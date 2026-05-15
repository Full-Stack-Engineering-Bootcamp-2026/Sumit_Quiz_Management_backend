import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { Quiz } from "../entities/quiz.entity";

import { UpdateQuizDto } from "../dto/quiz.dto";

@Service()
export class QuizRepository {
  private repository: Repository<Quiz>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(
        Quiz,
      );
  }

  async findAll(): Promise<
    Quiz[]
  > {
    return this.repository
      .createQueryBuilder(
        "quiz",
      )
      .leftJoinAndSelect(
        "quiz.createdBy",
        "createdBy",
      )
      .leftJoinAndSelect(
        "quiz.quizQuestions",
        "quizQuestions",
      )
      .leftJoinAndSelect(
        "quiz.attempts",
        "attempts",
      )
      .getMany();
  }

  async findById(
    id: string,
  ): Promise<Quiz | null> {
    return this.repository
      .createQueryBuilder(
        "quiz",
      )
      .leftJoinAndSelect(
        "quiz.createdBy",
        "createdBy",
      )
      .leftJoinAndSelect(
        "quiz.quizQuestions",
        "quizQuestions",
      )
      .leftJoinAndSelect(
        "quiz.attempts",
        "attempts",
      )
      .where(
        "quiz.publicId = :id",
        { id },
      )
      .getOne();
  }

  async create(
    data: Partial<Quiz>,
  ): Promise<Quiz> {
    const item =
      this.repository.create(data);

    return this.repository.save(item);
  }

  async update(
    id: string,
    data: UpdateQuizDto,
  ): Promise<Quiz | null> {
    await this.repository.update(
      {
        publicId: id,
      },
      {
        title: data.title,
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