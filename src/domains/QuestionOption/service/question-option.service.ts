import { Service } from "typedi";

import { QuestionOptionRepository } from "../repository/question-option.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { QuestionOption } from "../entities/question-option.entity";

import {
  QuestionOptionOutDto,
  CreateQuestionOptionDto,
  UpdateQuestionOptionDto,
} from "../dto/question-option.dto";

@Service()
export class QuestionOptionService {
  constructor(
    private readonly repository: QuestionOptionRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(
    item: QuestionOption,
  ): QuestionOptionOutDto {
    return {
      id: item.publicId,

      questionVersionId:
        item.questionVersion.publicId,

      optionText:
        item.optionText,

      createdAt:
        item.createdAt,
    };
  }

  public async getAll(): Promise<
    QuestionOptionOutDto[]
  > {
    this.logger.debug(
      "Fetching all question options",
    );

    const items =
      await this.repository.findAll();

    return items.map((item) =>
      this.mapToDto(item),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuestionOptionOutDto> {
    this.logger.debug(
      `Fetching question option with ID: ${id}`,
    );

    const item =
      await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        `Question option with ID ${id} not found`,
      );
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateQuestionOptionDto,
  ): Promise<QuestionOptionOutDto> {
    this.logger.info(
      "Creating question option",
    );

    const item =
      await this.repository.create({
        optionText:
          data.optionText,
      });

    return this.mapToDto(item);
  }

  public async update(
    id: string,
    data: UpdateQuestionOptionDto,
  ): Promise<QuestionOptionOutDto> {
    this.logger.info(
      `Updating question option: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Question option with ID ${id} not found`,
      );
    }

    const updated =
      await this.repository.update(
        id,
        data,
      );

    return this.mapToDto(
      updated as QuestionOption,
    );
  }

  public async delete(
    id: string,
  ): Promise<void> {
    this.logger.info(
      `Deleting question option: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Question option with ID ${id} not found`,
      );
    }

    await this.repository.delete(id);
  }
}