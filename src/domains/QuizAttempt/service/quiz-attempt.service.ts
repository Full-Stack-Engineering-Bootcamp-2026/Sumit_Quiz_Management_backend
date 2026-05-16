import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { QuizAttemptRepository } from "../repository/quiz-attempt.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import {
  BadRequestException,
  NotFoundException,
} from "../../../common/exceptions";

import { QuizAttempt } from "../entities/quiz-attempt.entity";

import { Quiz } from "../../Quiz/entities/quiz.entity";

import { User } from "../../User/entities/user.entity";

import { AttemptAnswer } from "../../AttemptAnswer/entities/attempt-answer.entity";

import { AttemptAnswerOption } from "../../AttemptAnswerOption/entities/attempt-answer-option.entity";

import { QuestionOption } from "../../QuestionOption/entities/question-option.entity";

import { QuizQuestion } from "../../QuizQuestion/entities/quiz-question.entity";

import { AnswerType } from "../../QuestionVersion/entities/question-version.entity";

import {
  QuizAttemptOutDto,
  CreateQuizAttemptDto,
} from "../dto/quiz-attempt.dto";

@Service()
export class QuizAttemptService {
  constructor(
    private readonly repository: QuizAttemptRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(
    item: QuizAttempt,
  ): QuizAttemptOutDto {
    return {
      id: item.publicId,

      userId:
        item.user.publicId,

      quizId:
        item.quiz.publicId,

      attemptNumber:
        item.attemptNumber,

      answers:
        item.answers?.map(
          (answer) => ({
            questionId:
              answer.question
                .publicId,

            questionVersionId:
              answer.questionVersion
                .publicId,

            answerText:
              answer.answerText,

            selectedOptionIds:
              answer.selectedOptions?.map(
                (option) =>
                  option
                    .questionOption
                    .publicId,
              ) || [],
          }),
        ) || [],

      submittedAt:
        item.submittedAt,
    };
  }

  public async getAll(): Promise<
    QuizAttemptOutDto[]
  > {
    this.logger.debug(
      "Fetching all quiz attempts",
    );

    const attempts =
      await this.repository.findAll();

    return attempts.map(
      (attempt) =>
        this.mapToDto(
          attempt,
        ),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuizAttemptOutDto> {
    this.logger.debug(
      `Fetching quiz attempt ${id}`,
    );

    const attempt =
      await this.repository.findById(
        id,
      );

    if (!attempt) {
      throw new NotFoundException(
        `Quiz attempt with ID ${id} not found`,
      );
    }

    return this.mapToDto(
      attempt,
    );
  }

  public async create(
    data: CreateQuizAttemptDto,
  ): Promise<QuizAttemptOutDto> {
    this.logger.info(
      "Creating quiz attempt",
    );

    return AppDataSource.transaction(
      async (manager) => {
        const quiz =
          await manager
            .createQueryBuilder(
              Quiz,
              "quiz",
            )
            .leftJoinAndSelect(
              "quiz.quizQuestions",
              "quizQuestions",
            )
            .leftJoinAndSelect(
              "quizQuestions.question",
              "question",
            )
            .leftJoinAndSelect(
              "quizQuestions.questionVersion",
              "questionVersion",
            )
            .where(
              "quiz.publicId = :id",
              {
                id: data.quizId,
              },
            )
            .getOne();

        if (!quiz) {
          throw new NotFoundException(
            `Quiz with ID ${data.quizId} not found`,
          );
        }

        const existingAttempts =
          await manager
            .createQueryBuilder(
              QuizAttempt,
              "quizAttempt",
            )
            .leftJoin(
              "quizAttempt.user",
              "user",
            )
            .leftJoin(
              "quizAttempt.quiz",
              "quiz",
            )
            .where(
              "user.publicId = :userId",
              {
                userId:
                  data.userId,
              },
            )
            .andWhere(
              "quiz.publicId = :quizId",
              {
                quizId:
                  data.quizId,
              },
            )
            .getCount();

        const attempt =
          manager.create(
            QuizAttempt,
            {
              user: {
                publicId:
                  data.userId,
              } as User,

              quiz,

              attemptNumber:
                existingAttempts +
                1,
            },
          );

        const savedAttempt =
          await manager.save(
            attempt,
          );

        const answers: AttemptAnswer[] =
          [];

        for (const submittedAnswer of data.answers) {
          const quizQuestion =
            quiz.quizQuestions.find(
              (
                question: QuizQuestion,
              ) =>
                question
                  .questionVersion
                  .publicId ===
                submittedAnswer.questionVersionId,
            );

          if (!quizQuestion) {
            throw new BadRequestException(
              "Question version does not belong to this quiz",
            );
          }

          const questionOptions =
            await manager
              .createQueryBuilder(
                QuestionOption,
                "questionOption",
              )
              .leftJoinAndSelect(
                "questionOption.questionVersion",
                "questionVersion",
              )
              .where(
                "questionVersion.id = :id",
                {
                  id: quizQuestion
                    .questionVersion.id,
                },
              )
              .getMany();

          const validOptionIds =
            questionOptions.map(
              (option) =>
                option.publicId,
            );

          const selectedOptionIds =
            submittedAnswer.selectedOptionIds ||
            [];

          const hasInvalidOption =
            selectedOptionIds.some(
              (optionId) =>
                !validOptionIds.includes(
                  optionId,
                ),
            );

          if (hasInvalidOption) {
            throw new BadRequestException(
              "Invalid option selected",
            );
          }

          if (
            quizQuestion
              .questionVersion
              .answerType ===
            AnswerType.TEXT
          ) {
            if (
              !submittedAnswer.answerText
            ) {
              throw new BadRequestException(
                "Answer text is required",
              );
            }

            if (
              selectedOptionIds.length >
              0
            ) {
              throw new BadRequestException(
                "Text questions cannot have selected options",
              );
            }
          }

          if (
            quizQuestion
              .questionVersion
              .answerType ===
            AnswerType.SINGLE_SELECT
          ) {
            if (
              selectedOptionIds.length !==
              1
            ) {
              throw new BadRequestException(
                "Single select questions must have exactly one selected option",
              );
            }
          }

          if (
            quizQuestion
              .questionVersion
              .answerType ===
            AnswerType.MULTI_SELECT
          ) {
            if (
              selectedOptionIds.length <
              1
            ) {
              throw new BadRequestException(
                "At least one option must be selected",
              );
            }
          }

          const answer =
            manager.create(
              AttemptAnswer,
              {
                attempt:
                  savedAttempt,

                question:
                  quizQuestion.question,

                questionVersion:
                  quizQuestion.questionVersion,

                answerText:
                  submittedAnswer.answerText,
              },
            );

          const savedAnswer =
            await manager.save(
              answer,
            );

          if (
            selectedOptionIds.length >
            0
          ) {
            const selectedOptions =
              selectedOptionIds.map(
                (
                  optionId,
                ) =>
                  manager.create(
                    AttemptAnswerOption,
                    {
                      attemptAnswer:
                        savedAnswer,

                      questionOption:
                        {
                          publicId:
                            optionId,
                        } as QuestionOption,
                    },
                  ),
              );

            const savedSelectedOptions =
              await manager.save(
                selectedOptions,
              );

            savedAnswer.selectedOptions =
              savedSelectedOptions;
          }

          answers.push(
            savedAnswer,
          );
        }

        savedAttempt.answers =
          answers;

        return this.mapToDto(
          savedAttempt,
        );
      },
    );
  }

  public async delete(
    id: string,
  ): Promise<void> {
    this.logger.info(
      `Deleting quiz attempt ${id}`,
    );

    const existingAttempt =
      await this.repository.findById(
        id,
      );

    if (!existingAttempt) {
      throw new NotFoundException(
        `Quiz attempt with ID ${id} not found`,
      );
    }

    await this.repository.delete(
      id,
    );
  }
}