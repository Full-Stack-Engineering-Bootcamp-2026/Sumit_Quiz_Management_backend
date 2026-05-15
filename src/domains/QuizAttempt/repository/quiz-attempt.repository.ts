import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { QuizAttempt } from "../entities/quiz-attempt.entity";

import { UpdateQuizAttemptDto } from "../dto/quiz-attempt.dto";

@Service()
export class QuizAttemptRepository {
  private repository: Repository<QuizAttempt>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(
        QuizAttempt,
      );
  }

  async findAll(): Promise<
    QuizAttempt[]
  > {
    return this.repository
      .createQueryBuilder(
        "quizAttempt",
      )
      .leftJoinAndSelect(
        "quizAttempt.user",
        "user",
      )
      .leftJoinAndSelect(
        "quizAttempt.quiz",
        "quiz",
      )
      .leftJoinAndSelect(
        "quizAttempt.answers",
        "answers",
      )
      .getMany();
  }

  async findById(
    id: string,
  ): Promise<QuizAttempt | null> {
    return this.repository
      .createQueryBuilder(
        "quizAttempt",
      )
      .leftJoinAndSelect(
        "quizAttempt.user",
        "user",
      )
      .leftJoinAndSelect(
        "quizAttempt.quiz",
        "quiz",
      )
      .leftJoinAndSelect(
        "quizAttempt.answers",
        "answers",
      )
      .where(
        "quizAttempt.publicId = :id",
        { id },
      )
      .getOne();
  }

  async create(
    data: Partial<QuizAttempt>,
  ): Promise<QuizAttempt> {
    const item =
      this.repository.create(data);

    return this.repository.save(item);
  }

  async update(
    id: string,
    data: UpdateQuizAttemptDto,
  ): Promise<QuizAttempt | null> {
    await this.repository.update(
      {
        publicId: id,
      },
      {
        attemptNumber:
          data.attemptNumber,
      },
    );

    return this.findById(id);
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    const result =
      await this.repository.delete({
        publicId: id,
      });

    return (
      (result.affected ?? 0) > 0
    );
  }
} 