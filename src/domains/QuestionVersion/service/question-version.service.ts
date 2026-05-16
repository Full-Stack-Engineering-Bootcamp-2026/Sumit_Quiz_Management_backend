import { Service } from "typedi";

import { QuestionVersionRepository } from "../repository/question-version.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { QuestionVersion } from "../entities/question-version.entity";

import {
  QuestionVersionOutDto,
  CreateQuestionVersionDto,
  UpdateQuestionVersionDto,
} from "../dto/question-version.dto";

@Service()
export class QuestionVersionService {
  constructor(
    private readonly repository: QuestionVersionRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(
    item: QuestionVersion,
  ): QuestionVersionOutDto {
    return {
      id: item.publicId,

      questionId:
        item.question.publicId,

      versionNumber:
        item.versionNumber,

      questionText:
        item.questionText,

      answerType:
        item.answerType,

      isActive:
        item.isActive,

      createdAt:
        item.createdAt,
    };
  }

  public async getAll(): Promise<
    QuestionVersionOutDto[]
  > {
    this.logger.debug(
      "Fetching all question versions",
    );

    const items =
      await this.repository.findAll();

    return items.map((item) =>
      this.mapToDto(item),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuestionVersionOutDto> {
    this.logger.debug(
      `Fetching question version with ID: ${id}`,
    );

    const item =
      await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        `Question version with ID ${id} not found`,
      );
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateQuestionVersionDto,
  ): Promise<QuestionVersionOutDto> {
    this.logger.info(
      "Creating question version",
    );

    const item =
      await this.repository.create({
        questionText:
          data.questionText,

        answerType:
          data.answerType,

        versionNumber:
          data.versionNumber,
      });

    return this.mapToDto(item);
  }


}