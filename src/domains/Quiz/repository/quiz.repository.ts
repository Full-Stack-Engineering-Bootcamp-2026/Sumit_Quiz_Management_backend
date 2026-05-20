import { Service } from "typedi";

import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { Quiz } from "../entities/quiz.entity";

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
        "quizQuestions.question",
        "question",
      )
      .leftJoinAndSelect(
        "question.versions",
        "versions",
      )
      .leftJoinAndSelect(
        "versions.options",
        "versionOptions",
      )
      .leftJoinAndSelect(
        "quizQuestions.questionVersion",
        "questionVersion",
      )
      .leftJoinAndSelect(
        "questionVersion.options",
        "options",
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
        "quizQuestions.question",
        "question",
      )
      .leftJoinAndSelect(
        "question.versions",
        "versions",
      )
      .leftJoinAndSelect(
        "versions.options",
        "versionOptions",
      )
      .leftJoinAndSelect(
        "quizQuestions.questionVersion",
        "questionVersion",
      )
      .leftJoinAndSelect(
        "questionVersion.options",
        "options",
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