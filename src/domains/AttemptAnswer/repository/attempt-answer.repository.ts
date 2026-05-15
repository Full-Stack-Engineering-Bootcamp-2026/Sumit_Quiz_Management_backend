import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { AttemptAnswer } from "../entities/attempt-answer.entity";

import { UpdateAttemptAnswerDto } from "../dto/attempt-answer.dto";

@Service()
export class AttemptAnswerRepository {
  private repository: Repository<AttemptAnswer>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(
        AttemptAnswer,
      );
  }

  async findAll(): Promise<
    AttemptAnswer[]
  > {
    return this.repository
      .createQueryBuilder(
        "attemptAnswer",
      )
      .leftJoinAndSelect(
        "attemptAnswer.attempt",
        "attempt",
      )
      .leftJoinAndSelect(
        "attemptAnswer.question",
        "question",
      )
      .leftJoinAndSelect(
        "attemptAnswer.questionVersion",
        "questionVersion",
      )
      .leftJoinAndSelect(
        "attemptAnswer.selectedOptions",
        "selectedOptions",
      )
      .getMany();
  }

  async findById(
    id: string,
  ): Promise<AttemptAnswer | null> {
    return this.repository
      .createQueryBuilder(
        "attemptAnswer",
      )
      .leftJoinAndSelect(
        "attemptAnswer.attempt",
        "attempt",
      )
      .leftJoinAndSelect(
        "attemptAnswer.question",
        "question",
      )
      .leftJoinAndSelect(
        "attemptAnswer.questionVersion",
        "questionVersion",
      )
      .leftJoinAndSelect(
        "attemptAnswer.selectedOptions",
        "selectedOptions",
      )
      .where(
        "attemptAnswer.publicId = :id",
        { id },
      )
      .getOne();
  }

  async create(
    data: Partial<AttemptAnswer>,
  ): Promise<AttemptAnswer> {
    const item =
      this.repository.create(data);

    return this.repository.save(item);
  }

  async update(
    id: string,
    data: UpdateAttemptAnswerDto,
  ): Promise<AttemptAnswer | null> {
    await this.repository.update(
      {
        publicId: id,
      },
      {
        answerText:
          data.answerText,
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