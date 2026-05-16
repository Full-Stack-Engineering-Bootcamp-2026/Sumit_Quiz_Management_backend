import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { QuestionVersion } from "../entities/question-version.entity";

import { UpdateQuestionVersionDto } from "../dto/question-version.dto";

@Service()
export class QuestionVersionRepository {
  private repository: Repository<QuestionVersion>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(
        QuestionVersion,
      );
  }

  async findAll(): Promise<
    QuestionVersion[]
  > {
    return this.repository
      .createQueryBuilder(
        "questionVersion",
      )
      .leftJoinAndSelect(
        "questionVersion.question",
        "question",
      )
      .leftJoinAndSelect(
        "questionVersion.options",
        "options",
      )
      .leftJoinAndSelect(
        "questionVersion.attemptAnswers",
        "attemptAnswers",
      )
      .getMany();
  }

  async findById(
    id: string,
  ): Promise<QuestionVersion | null> {
    return this.repository
      .createQueryBuilder(
        "questionVersion",
      )
      .leftJoinAndSelect(
        "questionVersion.question",
        "question",
      )
      .leftJoinAndSelect(
        "questionVersion.options",
        "options",
      )
      .leftJoinAndSelect(
        "questionVersion.attemptAnswers",
        "attemptAnswers",
      )
      .where(
        "questionVersion.publicId = :id",
        { id },
      )
      .getOne();
  }

  async create(
    data: Partial<QuestionVersion>,
  ): Promise<QuestionVersion> {
    const item =
      this.repository.create(data);

    return this.repository.save(item);
  }
}