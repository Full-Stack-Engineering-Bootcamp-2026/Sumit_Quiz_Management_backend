import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Generated,
} from "typeorm";

import { QuestionVersion } from "../../QuestionVersion/entities/question-version.entity";
import { AttemptAnswerOption } from "../../AttemptAnswerOption/entities/attempt-answer-option.entity";

@Entity("question_options")
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(
    () => QuestionVersion,
    (questionVersion) => questionVersion.options,
    {
      nullable: false,
      onDelete: "CASCADE",
    },
  )
  questionVersion: QuestionVersion;

  @Column({
    type: "varchar",
    length: 255,
  })
  optionText: string;

  @OneToMany(
    () => AttemptAnswerOption,
    (attemptAnswerOption) => attemptAnswerOption.questionOption,
  )
  selectedInAnswers: AttemptAnswerOption[];

  @CreateDateColumn()
  createdAt: Date;
}