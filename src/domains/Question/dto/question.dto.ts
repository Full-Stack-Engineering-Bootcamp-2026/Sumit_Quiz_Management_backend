import { AnswerType } from "../../QuestionVersion/entities/question-version.entity";

export interface QuestionOutDto {
  id: string;

  createdById: string;

  questionText: string;

  answerType: AnswerType;

  versionNumber: number;

  options: string[];

  createdAt: Date;
}

export interface CreateQuestionDto {
  createdById: string;

  questionText: string;

  answerType: AnswerType;

  options?: string[];
}

export interface UpdateQuestionDto {
  questionText: string;

  answerType: AnswerType;

  options?: string[];
}