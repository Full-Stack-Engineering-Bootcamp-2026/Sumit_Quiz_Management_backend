import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { QuestionRepository } from "../repository/question.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { Question } from "../entities/question.entity";

import { QuestionVersion } from "../../QuestionVersion/entities/question-version.entity";

import { QuestionOption } from "../../QuestionOption/entities/question-option.entity";

import { User } from "../../User/entities/user.entity";

import {
  QuestionOutDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from "../dto/question.dto";

@Service()
export class QuestionService {
  constructor(
    private readonly repository: QuestionRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(
    item: Question,
  ): QuestionOutDto {
    const latestVersion =
      item.versions?.sort(
        (a, b) =>
          b.versionNumber -
          a.versionNumber,
      )[0];

    return {
      id: item.publicId,

      createdById:
        item.createdBy.publicId,

      questionText:
        latestVersion?.questionText ||
        "",

      answerType:
        latestVersion?.answerType,

      versionNumber:
        latestVersion?.versionNumber ||
        1,

      options:
        latestVersion?.options?.map(
          (option) =>
            option.optionText,
        ) || [],

      createdAt:
        item.createdAt,
    };
  }

  public async getAll(): Promise<
    QuestionOutDto[]
  > {
    this.logger.debug(
      "Fetching all questions",
    );

    const items =
      await this.repository.findAll();

    return items.map((item) =>
      this.mapToDto(item),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuestionOutDto> {
    this.logger.debug(
      `Fetching question with ID: ${id}`,
    );

    const item =
      await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        `Question with ID ${id} not found`,
      );
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateQuestionDto,
  ): Promise<QuestionOutDto> {
    this.logger.info(
      "Creating question",
    );

    return AppDataSource.transaction(
      async (
        transactionalEntityManager,
      ) => {
        const question =
          transactionalEntityManager.create(
            Question,
            {
              createdBy: {
                publicId:
                  data.createdById,
              } as User,
            },
          );

        const savedQuestion =
          await transactionalEntityManager.save(
            question,
          );

        const questionVersion =
          transactionalEntityManager.create(
            QuestionVersion,
            {
              question:
                savedQuestion,

              versionNumber: 1,

              questionText:
                data.questionText,

              answerType:
                data.answerType,
            },
          );

        const savedVersion =
          await transactionalEntityManager.save(
            questionVersion,
          );

        if (
          data.options &&
          data.options.length > 0
        ) {
          const options =
            data.options.map(
              (
                optionText: string,
              ) =>
                transactionalEntityManager.create(
                  QuestionOption,
                  {
                    questionVersion:
                      savedVersion,

                    optionText:
                      optionText,
                  },
                ),
            );

          const savedOptions =
            await transactionalEntityManager.save(
              options,
            );

          savedVersion.options =
            savedOptions;
        }

        savedQuestion.versions = [
          savedVersion,
        ];

        return this.mapToDto(
          savedQuestion,
        );
      },
    );
  }

  public async update(
    id: string,
    data: UpdateQuestionDto,
  ): Promise<QuestionOutDto> {
    this.logger.info(
      `Creating new version for question: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Question with ID ${id} not found`,
      );
    }

    const latestVersion =
      existing.versions?.sort(
        (a, b) =>
          b.versionNumber -
          a.versionNumber,
      )[0];

    const nextVersionNumber =
      latestVersion
        ? latestVersion.versionNumber +
          1
        : 1;

    return AppDataSource.transaction(
      async (
        transactionalEntityManager,
      ) => {
        const newVersion =
          transactionalEntityManager.create(
            QuestionVersion,
            {
              question:
                existing,

              versionNumber:
                nextVersionNumber,

              questionText:
                data.questionText,

              answerType:
                data.answerType,

              isActive: true,
            },
          );

        const savedVersion =
          await transactionalEntityManager.save(
            newVersion,
          );

        if (
          data.options &&
          data.options.length > 0
        ) {
          const options =
            data.options.map(
              (
                optionText: string,
              ) =>
                transactionalEntityManager.create(
                  QuestionOption,
                  {
                    questionVersion:
                      savedVersion,

                    optionText:
                      optionText,
                  },
                ),
            );

          const savedOptions =
            await transactionalEntityManager.save(
              options,
            );

          savedVersion.options =
            savedOptions;
        }

        existing.versions = [
          ...existing.versions,
          savedVersion,
        ];

        return this.mapToDto(
          existing,
        );
      },
    );
  }

  public async delete(
    id: string,
  ): Promise<void> {
    this.logger.info(
      `Deleting question: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Question with ID ${id} not found`,
      );
    }

    await this.repository.delete(
      id,
    );
  }
}