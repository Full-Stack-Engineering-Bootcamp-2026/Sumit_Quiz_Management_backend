import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { QuizQuestion } from "../entities/quiz-question.entity";

import { UpdateQuizQuestionDto } from "../dto/quiz-question.dto";

@Service()
export class QuizQuestionRepository {
  private repository: Repository<QuizQuestion>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(
        QuizQuestion,
      );
  }

  async findAll(): Promise<
    QuizQuestion[]
  > {
    return this.repository
      .createQueryBuilder(
        "quizQuestion",
      )
      .leftJoinAndSelect(
        "quizQuestion.quiz",
        "quiz",
      )
      .leftJoinAndSelect(
        "quizQuestion.question",
        "question",
      )
      .leftJoinAndSelect(
        "quizQuestion.questionVersion",
        "questionVersion",
      )
      .getMany();
  }

  async findById(
    id: string,
  ): Promise<QuizQuestion | null> {
    return this.repository
      .createQueryBuilder(
        "quizQuestion",
      )
      .leftJoinAndSelect(
        "quizQuestion.quiz",
        "quiz",
      )
      .leftJoinAndSelect(
        "quizQuestion.question",
        "question",
      )
      .leftJoinAndSelect(
        "quizQuestion.questionVersion",
        "questionVersion",
      )
      .where(
        "quizQuestion.publicId = :id",
        { id },
      )
      .getOne();
  }

  async create(
    data: Partial<QuizQuestion>,
  ): Promise<QuizQuestion> {
    const item =
      this.repository.create(data);

    return this.repository.save(item);
  }

  async update(
    id: string,
    data: UpdateQuizQuestionDto,
  ): Promise<QuizQuestion | null> {
    await this.repository.update(
      {
        publicId: id,
      },
      {},
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