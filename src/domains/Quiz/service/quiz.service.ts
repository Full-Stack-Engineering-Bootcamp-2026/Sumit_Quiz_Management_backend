import { Service } from "typedi";

import { QuizRepository } from "../repository/quiz.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { Quiz } from "../entities/quiz.entity";

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
    return {
      id: item.publicId,

      title: item.title,

      createdById:
        item.createdBy.publicId,

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

    const items =
      await this.repository.findAll();

    return items.map((item) =>
      this.mapToDto(item),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuizOutDto> {
    this.logger.debug(
      `Fetching quiz with ID: ${id}`,
    );

    const item =
      await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        `Quiz with ID ${id} not found`,
      );
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateQuizDto,
  ): Promise<QuizOutDto> {
    this.logger.info(
      "Creating quiz",
    );

    const item =
      await this.repository.create({
        title: data.title,
      });

    return this.mapToDto(item);
  }

  public async update(
    id: string,
    data: UpdateQuizDto,
  ): Promise<QuizOutDto> {
    this.logger.info(
      `Updating quiz: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Quiz with ID ${id} not found`,
      );
    }

    const updated =
      await this.repository.update(
        id,
        data,
      );

    return this.mapToDto(
      updated as Quiz,
    );
  }

  public async delete(
    id: string,
  ): Promise<void> {
    this.logger.info(
      `Deleting quiz: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Quiz with ID ${id} not found`,
      );
    }

    await this.repository.delete(id);
  }
}