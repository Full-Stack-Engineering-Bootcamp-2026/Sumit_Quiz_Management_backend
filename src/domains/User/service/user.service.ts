import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { Service } from "typedi";

import {
  ConflictException,
  UnauthorizedException,
} from "../../../common/exceptions";

import { UserRepository } from "../repository/user.repository";

import { LoginUserDto } from "../dto/login-user.dto";

import { RegisterUserDto } from "../dto/login-user.dto"; 

import { UserRole } from "../entities/user.entity";

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async registerUser(
    payload: RegisterUserDto,
  ) {
    const {
      name,
      email,
      password,
    } = payload;

    const existingUser =
      await this.userRepository.findByEmail(
        email,
      );

    if (existingUser) {
      throw new ConflictException(
        "Email already exists",
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10,
      );

    const user =
      await this.userRepository.createUser(
        {
          name,

          email,

          password:
            hashedPassword,

          role:
            UserRole.USER,
        },
      );

    return {
      publicId:
        user.publicId,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,
    };
  }

  async registerAdmin(
    payload: RegisterUserDto,
  ) {
    const {
      name,
      email,
      password,
    } = payload;

    const existingUser =
      await this.userRepository.findByEmail(
        email,
      );

    if (existingUser) {
      throw new ConflictException(
        "Email already exists",
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10,
      );

    const admin =
      await this.userRepository.createUser(
        {
          name,

          email,

          password:
            hashedPassword,

          role:
            UserRole.ADMIN,
        },
      );

    return {
      publicId:
        admin.publicId,

      name:
        admin.name,

      email:
        admin.email,

      role:
        admin.role,
    };
  }

  async login(
    payload: LoginUserDto,
  ) {
    const {
      email,
      password,
    } = payload;

    const user =
      await this.userRepository.findByEmail(
        email,
      );

    if (!user) {
      throw new UnauthorizedException(
        "Invalid credentials",
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "Invalid credentials",
      );
    }

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        "JWT_SECRET missing",
      );
    }

    const token = jwt.sign(
      {
        userId:
          user.id,

        email:
          user.email,

        role:
          user.role,
      },

      secret,

      {
        expiresIn: "1d",
      },
    );

    return {
      token,

      user: {
        publicId:
          user.publicId,

        email:
          user.email,

        name:
          user.name,

        role:
          user.role,
      },
    };
  }
}