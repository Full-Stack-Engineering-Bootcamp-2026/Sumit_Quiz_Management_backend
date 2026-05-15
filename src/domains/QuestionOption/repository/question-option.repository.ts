import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { QuestionOption } from "../entities/question-option.entity";

import { UpdateQuestionOptionDto } from "../dto/question-option.dto";

@Service()
export class QuestionOptionRepository {
  private repository: Repository<QuestionOption>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(
        QuestionOption,
      );
  }

  async findAll(): Promise<
    QuestionOption[]
  > {
    return this.repository
      .createQueryBuilder(
        "questionOption",
      )
      .leftJoinAndSelect(
        "questionOption.questionVersion",
        "questionVersion",
      )
      .leftJoinAndSelect(
        "questionOption.selectedInAnswers",
        "selectedInAnswers",
      )
      .getMany();
  }

  async findById(
    id: string,
  ): Promise<QuestionOption | null> {
    return this.repository
      .createQueryBuilder(
        "questionOption",
      )
      .leftJoinAndSelect(
        "questionOption.questionVersion",
        "questionVersion",
      )
      .leftJoinAndSelect(
        "questionOption.selectedInAnswers",
        "selectedInAnswers",
      )
      .where(
        "questionOption.publicId = :id",
        { id },
      )
      .getOne();
  }

  async create(
    data: Partial<QuestionOption>,
  ): Promise<QuestionOption> {
    const item =
      this.repository.create(data);

    return this.repository.save(item);
  }

  async update(
    id: string,
    data: UpdateQuestionOptionDto,
  ): Promise<QuestionOption | null> {
    await this.repository.update(
      {
        publicId: id,
      },
      {
        optionText:
          data.optionText,
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