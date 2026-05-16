// src/domains/Auth/dto/auth.dto.ts

export interface LoginUserDto {
  email: string;

  password: string;
}

export interface RegisterUserDto {
  name: string;

  email: string;

  password: string;
}

export interface AuthResponseDto {
  token: string;

  user: {
    id: number;

    publicId: string;

    name: string;

    email: string;

    role: string;
  };
}