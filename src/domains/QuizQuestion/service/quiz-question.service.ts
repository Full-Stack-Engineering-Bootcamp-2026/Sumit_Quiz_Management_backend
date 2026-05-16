import { Service } from "typedi";

import { QuizQuestionRepository } from "../repository/quiz-question.repository";

import { LoggerService } from "../../../common/utils/logger.service";

import { NotFoundException } from "../../../common/exceptions";

import { QuizQuestion } from "../entities/quiz-question.entity";

import {
  QuizQuestionOutDto,
  CreateQuizQuestionDto,
  UpdateQuizQuestionDto,
} from "../dto/quiz-question.dto";

@Service()
export class QuizQuestionService {
  constructor(
    private readonly repository: QuizQuestionRepository,

    private readonly logger: LoggerService,
  ) {}

  private mapToDto(
    item: QuizQuestion,
  ): QuizQuestionOutDto {
    return {
      id: item.publicId,

      quizId:
        item.quiz.publicId,

      questionId:
        item.question.publicId,

      questionVersionId:
        item.questionVersion.publicId,
    };
  }

  public async getAll(): Promise<
    QuizQuestionOutDto[]
  > {
    this.logger.debug(
      "Fetching all quiz questions",
    );

    const items =
      await this.repository.findAll();

    return items.map((item) =>
      this.mapToDto(item),
    );
  }

  public async getById(
    id: string,
  ): Promise<QuizQuestionOutDto> {
    this.logger.debug(
      `Fetching quiz question with ID: ${id}`,
    );

    const item =
      await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        `Quiz question with ID ${id} not found`,
      );
    }

    return this.mapToDto(item);
  }

  public async create(
    data: CreateQuizQuestionDto,
  ): Promise<QuizQuestionOutDto> {
    this.logger.info(
      "Creating quiz question",
    );

    const item =
      await this.repository.create({});

    return this.mapToDto(item);
  }

  public async update(
    id: string,
    data: UpdateQuizQuestionDto,
  ): Promise<QuizQuestionOutDto> {
    this.logger.info(
      `Updating quiz question: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Quiz question with ID ${id} not found`,
      );
    }

    const updated =
      await this.repository.update(
        id,
        data,
      );

    return this.mapToDto(
      updated as QuizQuestion,
    );
  }

  public async delete(
    id: string,
  ): Promise<void> {
    this.logger.info(
      `Deleting quiz question: ${id}`,
    );

    const existing =
      await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Quiz question with ID ${id} not found`,
      );
    }

    await this.repository.delete(id);
  }
}