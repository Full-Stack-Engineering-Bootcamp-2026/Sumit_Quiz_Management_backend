import { Service } from "typedi";

import { AppDataSource } from "../../../db/db";

import { User } from "../entities/user.entity";

@Service()
export class UserRepository {
  private readonly repository = AppDataSource.getRepository(User);

  public async findByEmail(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
  }


  public async createUser(payload: Partial<User>): Promise<User> {
    const user = this.repository.create(payload);

    return await this.repository.save(user);
  }


  public async findAllUsers(): Promise<User[]> {
    return await this.repository.find({
      order: {
        createdAt: "DESC",
      },

      select: {
        id: true,
        publicId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  public async findByPublicId(publicId: string): Promise<User | null> {
    return await this.repository.findOne({
      where: {
        publicId,
      },
    });
  }

  
  public async deleteUser(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
