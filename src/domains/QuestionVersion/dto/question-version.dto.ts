import { AnswerType } from "../entities/question-version.entity";

export interface QuestionVersionOutDto {
  id: string;

  questionId: string;

  versionNumber: number;

  questionText: string;

  answerType: AnswerType;

  isActive: boolean;

  createdAt: Date;
}

export interface CreateQuestionVersionDto {
  questionId: string;

  questionText: string;

  answerType: AnswerType;

  versionNumber: number;
}

export interface UpdateQuestionVersionDto {
  questionText?: string;

  answerType?: AnswerType;

  isActive?: boolean;
}