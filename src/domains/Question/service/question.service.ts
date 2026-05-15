import { Service } from "typedi";

import { QuestionRepository } from "../repository/question.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { Question } from "../entities/question.entity";

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
    return {
      id: item.publicId,

      createdById:
        item.createdBy.publicId,

      isDeleted:
        item.isDeleted,

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

    const item =
      await this.repository.create({});

    return this.mapToDto(item);
  }

  public async update(
    id: string,
    data: UpdateQuestionDto,
  ): Promise<QuestionOutDto> {
    this.logger.info(
      `Updating question: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Question with ID ${id} not found`,
      );
    }

    const updated =
      await this.repository.update(
        id,
        data,
      );

    return this.mapToDto(
      updated as Question,
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

    await this.repository.delete(id);
  }
}