import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { Question } from "../entities/question.entity";

import { UpdateQuestionDto } from "../dto/question.dto";

@Service()
export class QuestionRepository {
  private repository: Repository<Question>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(
        Question,
      );
  }

  async findAll(): Promise<
    Question[]
  > {
    return this.repository
      .createQueryBuilder(
        "question",
      )
      .leftJoinAndSelect(
        "question.createdBy",
        "createdBy",
      )
      .leftJoinAndSelect(
        "question.versions",
        "versions",
      )
      .leftJoinAndSelect(
        "question.quizQuestions",
        "quizQuestions",
      )
      .where(
        "question.isDeleted = :isDeleted",
        {
          isDeleted: false,
        },
      )
      .getMany();
  }

  async findById(
    id: string,
  ): Promise<Question | null> {
    return this.repository
      .createQueryBuilder(
        "question",
      )
      .leftJoinAndSelect(
        "question.createdBy",
        "createdBy",
      )
      .leftJoinAndSelect(
        "question.versions",
        "versions",
      )
      .leftJoinAndSelect(
        "question.quizQuestions",
        "quizQuestions",
      )
      .where(
        "question.publicId = :id",
        { id },
      )
      .andWhere(
        "question.isDeleted = :isDeleted",
        {
          isDeleted: false,
        },
      )
      .getOne();
  }

  async create(
    data: Partial<Question>,
  ): Promise<Question> {
    const item =
      this.repository.create(data);

    return this.repository.save(item);
  }

  async update(
    id: string,
    data: UpdateQuestionDto,
  ): Promise<Question | null> {
    await this.repository.update(
      {
        publicId: id,
      },
      {
        ...data,
      },
    );

    return this.findById(id);
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    const result =
      await this.repository.update(
        {
          publicId: id,
        },
        {
          isDeleted: true,
        },
      );

    return (
      (result.affected ?? 0) > 0
    );
  }
}