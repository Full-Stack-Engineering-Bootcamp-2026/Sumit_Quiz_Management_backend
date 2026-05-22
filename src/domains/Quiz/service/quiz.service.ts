import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { QuizRepository } from "../repository/quiz.repository";

import { Quiz } from "../entities/quiz.entity";

import { QuizQuestion } from "../../QuizQuestion/entities/quiz-question.entity";

import { QuestionVersion } from "../../QuestionVersion/entities/question-version.entity";

import { User } from "../../User/entities/user.entity";

import {
  QuizOutDto,
  CreateQuizDto,
  UpdateQuizDto,
} from "../dto/quiz.dto";

@Service()
export class QuizService {
  constructor(
    private readonly repository: QuizRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(
    item: Quiz,
  ): QuizOutDto {
    const seen =
      new Set<string>();

    const uniqueQuizQuestions = (
      item.quizQuestions || []
    ).filter((qq) => {
      const qId =
        qq.question?.publicId;

      if (
        !qId ||
        seen.has(qId)
      ) {
        return false;
      }

      seen.add(qId);

      return true;
    });

    return {
      id: item.publicId,

      title: item.title,

      createdById:
        item.createdBy
          ?.publicId || "",

      questions:
        uniqueQuizQuestions.map(
          (
            quizQuestion,
          ) => {
            const version =
              quizQuestion.questionVersion;

            return {
              questionId:
                quizQuestion
                  .question
                  .publicId,

              questionVersionId:
                version.publicId,

              versionNumber:
                version.versionNumber,

              questionText:
                version.questionText,

              answerType:
                version.answerType,

              options:
                version.options?.map(
                  (
                    option,
                  ) => ({
                    id: option.publicId,

                    optionText:
                      option.optionText,
                  }),
                ) || [],
            };
          },
        ) || [],

      createdAt:
        item.createdAt,
    };
  }

  public async getAll(): Promise<
    QuizOutDto[]
  > {
    this.logger.debug(
      "Fetching all quizzes",
    );

    const quizzes =
      await this.repository.findAll();

    return quizzes.map(
      (quiz) =>
        this.mapToDto(
          quiz,
        ),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuizOutDto> {
    this.logger.debug(
      `Fetching quiz with ID ${id}`,
    );

    const quiz =
      await this.repository.findById(
        id,
      );

    if (!quiz) {
      throw new NotFoundException(
        `Quiz with ID ${id} not found`,
      );
    }

    return this.mapToDto(
      quiz,
    );
  }

  public async create(
    data: CreateQuizDto,
  ): Promise<QuizOutDto> {
    this.logger.info(
      "Creating quiz",
    );

    return AppDataSource.transaction(
      async (manager) => {
        const user =
          await manager.findOne(
            User,
            {
              where: {
                publicId:
                  data.createdById,
              },
            },
          );

        if (!user) {
          throw new NotFoundException(
            "User not found",
          );
        }

        const quiz =
          manager.create(
            Quiz,
            {
              title:
                data.title,

              createdBy:
                user,
            },
          );

        const savedQuiz =
          await manager.save(
            quiz,
          );

        const questionVersions =
          await manager
            .createQueryBuilder(
              QuestionVersion,
              "questionVersion",
            )
            .leftJoinAndSelect(
              "questionVersion.question",
              "question",
            )
            .leftJoinAndSelect(
              "questionVersion.options",
              "options",
            )
            .where(
              "questionVersion.publicId IN (:...ids)",
              {
                ids: data.questionVersionIds,
              },
            )
            .getMany();

        const quizQuestions =
          questionVersions.map(
            (
              questionVersion,
            ) =>
              manager.create(
                QuizQuestion,
                {
                  quiz:
                    savedQuiz,

                  question:
                    questionVersion.question,

                  questionVersion,
                },
              ),
          );

        await manager.save(
          quizQuestions,
        );

        const createdQuiz =
          await this.repository.findById(
            savedQuiz.publicId,
          );

        return this.mapToDto(
          createdQuiz!,
        );
      },
    );
  }

  public async update(
    id: string,
    data: UpdateQuizDto,
  ): Promise<QuizOutDto> {
    this.logger.info(
      `Updating quiz ${id}`,
    );

    const existingQuiz =
      await this.repository.findById(
        id,
      );

    if (!existingQuiz) {
      throw new NotFoundException(
        `Quiz with ID ${id} not found`,
      );
    }

    return AppDataSource.transaction(
      async (manager) => {
        if (data.title) {
          existingQuiz.title =
            data.title;

          await manager.save(
            existingQuiz,
          );
        }

        if (
          data.questionVersionIds
        ) {
          await manager.delete(
            QuizQuestion,
            {
              quiz: {
                id: existingQuiz.id,
              },
            },
          );

          const questionVersions =
            await manager
              .createQueryBuilder(
                QuestionVersion,
                "questionVersion",
              )
              .leftJoinAndSelect(
                "questionVersion.question",
                "question",
              )
              .leftJoinAndSelect(
                "questionVersion.options",
                "options",
              )
              .where(
                "questionVersion.publicId IN (:...ids)",
                {
                  ids: data.questionVersionIds,
                },
              )
              .getMany();

          const quizQuestions =
            questionVersions.map(
              (
                questionVersion,
              ) =>
                manager.create(
                  QuizQuestion,
                  {
                    quiz:
                      existingQuiz,

                    question:
                      questionVersion.question,

                    questionVersion,
                  },
                ),
            );

          await manager.save(
            quizQuestions,
          );
        }

        const updatedQuiz =
          await this.repository.findById(
            existingQuiz.publicId,
          );

        return this.mapToDto(
          updatedQuiz!,
        );
      },
    );
  }

  public async delete(
    id: string,
  ): Promise<void> {
    this.logger.info(
      `Deleting quiz ${id}`,
    );

    const existingQuiz =
      await this.repository.findById(
        id,
      );

    if (!existingQuiz) {
      throw new NotFoundException(
        `Quiz with ID ${id} not found`,
      );
    }

    await this.repository.delete(
      id,
    );
  }
}