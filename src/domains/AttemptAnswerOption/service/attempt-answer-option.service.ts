import { Service } from "typedi";

import { AttemptAnswerOptionRepository } from "../repository/attempt-answer-option.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { AttemptAnswerOption } from "../entities/attempt-answer-option.entity";

import {
  AttemptAnswerOptionOutDto,
  CreateAttemptAnswerOptionDto,
} from "../dto/attempt-answer-option.dto";

@Service()
export class AttemptAnswerOptionService {
  constructor(
    private readonly repository: AttemptAnswerOptionRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(item: AttemptAnswerOption): AttemptAnswerOptionOutDto {
    return {
      id: item.publicId,

      attemptAnswerId: item.attemptAnswer.publicId,

      questionOptionId: item.questionOption.publicId,
    };
  }

  public async getAll(): Promise<AttemptAnswerOptionOutDto[]> {
    this.logger.debug("Fetching all attempt answer options");

    const items = await this.repository.findAll();

    return items.map((item) => this.mapToDto(item));
  }

  public async getById(id: string): Promise<AttemptAnswerOptionOutDto> {
    this.logger.debug(`Fetching attempt answer option with ID: ${id}`);

    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        `Attempt answer option with ID ${id} not found`,
      );
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateAttemptAnswerOptionDto,
  ): Promise<AttemptAnswerOptionOutDto> {
    this.logger.info("Creating attempt answer option");

    const item = await this.repository.create({});

    return this.mapToDto(item);
  }

  public async delete(id: string): Promise<void> {
    this.logger.info(`Deleting attempt answer option: ${id}`);

    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Attempt answer option with ID ${id} not found`,
      );
    }

    await this.repository.delete(id);
  }
}
