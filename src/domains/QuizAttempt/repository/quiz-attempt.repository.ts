import { Service } from "typedi";

import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { QuizAttempt } from "../entities/quiz-attempt.entity";

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
    return await this.repository.find(
      {
        relations: {
          user: true,
          quiz: true,
          answers: {
            question: true,
            questionVersion: true,
            selectedOptions: {
              questionOption: true,
            },
          },
        },
      },
    );
  }

  async findById(
    id: string,
  ): Promise<QuizAttempt | null> {
    return await this.repository.findOne(
      {
        where: {
          publicId: id,
        },

        relations: {
          user: true,
          quiz: true,
          answers: {
            question: true,
            questionVersion: true,
            selectedOptions: {
              questionOption: true,
            },
          },
        },
      },
    );
  }

  async create(
    data: Partial<QuizAttempt>,
  ): Promise<QuizAttempt> {
    const item =
      this.repository.create(
        data,
      );

    return await this.repository.save(
      item,
    );
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    const result =
      await this.repository.delete(
        {
          publicId: id,
        },
      );

    return (
      (result.affected ?? 0) > 0
    );
  }
}