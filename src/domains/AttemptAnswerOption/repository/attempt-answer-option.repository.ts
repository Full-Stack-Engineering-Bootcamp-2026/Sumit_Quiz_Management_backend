import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { AttemptAnswerOption } from "../entities/attempt-answer-option.entity";

@Service()
export class AttemptAnswerOptionRepository {
  private repository: Repository<AttemptAnswerOption>;

  constructor() {
    this.repository = AppDataSource.getRepository(AttemptAnswerOption);
  }

  async findAll(): Promise<AttemptAnswerOption[]> {
    return this.repository
      .createQueryBuilder("attemptAnswerOption")
      .leftJoinAndSelect("attemptAnswerOption.attemptAnswer", "attemptAnswer")
      .leftJoinAndSelect("attemptAnswerOption.questionOption", "questionOption")
      .getMany();
  }

  async findById(id: string): Promise<AttemptAnswerOption | null> {
    return this.repository
      .createQueryBuilder("attemptAnswerOption")
      .leftJoinAndSelect("attemptAnswerOption.attemptAnswer", "attemptAnswer")
      .leftJoinAndSelect("attemptAnswerOption.questionOption", "questionOption")
      .where("attemptAnswerOption.publicId = :id", { id })
      .getOne();
  }

  async create(
    data: Partial<AttemptAnswerOption>,
  ): Promise<AttemptAnswerOption> {
    const item = this.repository.create(data);

    return this.repository.save(item);
  }

  async update(id: string): Promise<AttemptAnswerOption | null> {
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete({
      publicId: id,
    });

    return (result.affected ?? 0) > 0;
  }
}
