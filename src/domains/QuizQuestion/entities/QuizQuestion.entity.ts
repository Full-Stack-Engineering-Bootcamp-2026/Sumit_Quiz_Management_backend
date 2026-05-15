import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
  Generated,
} from "typeorm";

import { Quiz } from "../../Quiz/entities/quiz.entity";
import { Question } from "../../Question/entities/question.entity";
import { QuestionVersion } from "../../QuestionVersion/entities/question-version.entity";

@Entity("quiz_questions")
@Unique(["quiz", "questionVersion"])
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizQuestions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.quizQuestions, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  question: Question;

  @ManyToOne(() => QuestionVersion, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  questionVersion: QuestionVersion;
}