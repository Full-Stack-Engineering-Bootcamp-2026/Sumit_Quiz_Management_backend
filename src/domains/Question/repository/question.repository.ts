import { Service } from "typedi";

import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { Question } from "../entities/question.entity";

@Service()
export class QuestionRepository {
  private repository: Repository<Question>;

  constructor() {
    this.repository = AppDataSource.getRepository(Question);
  }

  async findAll(): Promise<Question[]> {
    return await this.repository.find({
      where: {
        isDeleted: false,
      },
      relations: ["createdBy", "versions", "versions.options"],
    });
  }

  async findById(id: string): Promise<Question | null> {
    return await this.repository.findOne({
      where: {
        publicId: id,
        isDeleted: false,
      },
      relations: ["createdBy", "versions", "versions.options"],
    });
  }

  async create(data: Partial<Question>): Promise<Question> {
    const item = this.repository.create(data);

    return await this.repository.save(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.update(
      {
        publicId: id,
      },
      {
        isDeleted: true,
      },
    );

    return (result.affected ?? 0) > 0;
  }
}
