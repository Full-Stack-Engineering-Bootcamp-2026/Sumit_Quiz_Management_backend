import { Service } from "typedi";

import { QuizAttemptRepository } from "../repository/quiz-attempt.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { QuizAttempt } from "../entities/quiz-attempt.entity";

import {
  QuizAttemptOutDto,
  CreateQuizAttemptDto,
  UpdateQuizAttemptDto,
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

    const items =
      await this.repository.findAll();

    return items.map((item) =>
      this.mapToDto(item),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuizAttemptOutDto> {
    this.logger.debug(
      `Fetching quiz attempt with ID: ${id}`,
    );

    const item =
      await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        `Quiz attempt with ID ${id} not found`,
      );
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateQuizAttemptDto,
  ): Promise<QuizAttemptOutDto> {
    this.logger.info(
      "Creating quiz attempt",
    );

    const item =
      await this.repository.create({
        attemptNumber:
          data.attemptNumber,
      });

    return this.mapToDto(item);
  }

  public async update(
    id: string,
    data: UpdateQuizAttemptDto,
  ): Promise<QuizAttemptOutDto> {
    this.logger.info(
      `Updating quiz attempt: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Quiz attempt with ID ${id} not found`,
      );
    }

    const updated =
      await this.repository.update(
        id,
        data,
      );

    return this.mapToDto(
      updated as QuizAttempt,
    );
  }

  public async delete(
    id: string,
  ): Promise<void> {
    this.logger.info(
      `Deleting quiz attempt: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Quiz attempt with ID ${id} not found`,
      );
    }

    await this.repository.delete(id);
  }
}