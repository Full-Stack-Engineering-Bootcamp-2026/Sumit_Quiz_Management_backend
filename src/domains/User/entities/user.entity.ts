import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Generated,
} from "typeorm";
import { Quiz } from "../../Quiz/entities/quiz.entity";
import { QuizAttempt } from "../../QuizAttempt/entities/quiz-attempt.entity";
import { Question } from "../../Question/entities/question.entity";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    unique: true,
    length: 150,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Quiz, (quiz) => quiz.createdBy)
  quizzes: Quiz[];

  @OneToMany(() => Question, (question) => question.createdBy)
  questions: Question[];

  @OneToMany(() => QuizAttempt, (attempt) => attempt.user)
  attempts: QuizAttempt[];

  @CreateDateColumn()
  createdAt: Date;
}
