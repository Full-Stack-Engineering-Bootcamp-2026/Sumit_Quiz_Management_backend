import { Service } from "typedi";

import { AttemptAnswerRepository } from "../repository/attempt-answer.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { AttemptAnswer } from "../entities/attempt-answer.entity";

import {
  AttemptAnswerOutDto,
  CreateAttemptAnswerDto,
  UpdateAttemptAnswerDto,
} from "../dto/attempt-answer.dto";

@Service()
export class AttemptAnswerService {
  constructor(
    private readonly repository: AttemptAnswerRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(item: AttemptAnswer): AttemptAnswerOutDto {
    return {
      id: item.publicId,

      attemptId: item.attempt.publicId,

      questionId: item.question.publicId,

      questionVersionId: item.questionVersion.publicId,

      answerText: item.answerText,

      selectedOptions:
        item.selectedOptions?.map((option) => option.questionOption.publicId) ||
        [],
    };
  }

  public async getAll(): Promise<AttemptAnswerOutDto[]> {
    this.logger.debug("Fetching all attempt answers");

    const items = await this.repository.findAll();

    return items.map((item) => this.mapToDto(item));
  }

  public async getById(id: string): Promise<AttemptAnswerOutDto> {
    this.logger.debug(`Fetching attempt answer with ID: ${id}`);

    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(`Attempt answer with ID ${id} not found`);
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateAttemptAnswerDto,
  ): Promise<AttemptAnswerOutDto> {
    this.logger.info("Creating new attempt answer");

    const item = await this.repository.create({
      answerText: data.answerText,
    });

    return this.mapToDto(item);
  }

  public async update(
    id: string,
    data: UpdateAttemptAnswerDto,
  ): Promise<AttemptAnswerOutDto> {
    this.logger.info(`Updating attempt answer: ${id}`);

    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Attempt answer with ID ${id} not found`);
    }

    const updated = await this.repository.update(id, data);

    return this.mapToDto(updated as AttemptAnswer);
  }

  public async delete(id: string): Promise<void> {
    this.logger.info(`Deleting attempt answer: ${id}`);

    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Attempt answer with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
