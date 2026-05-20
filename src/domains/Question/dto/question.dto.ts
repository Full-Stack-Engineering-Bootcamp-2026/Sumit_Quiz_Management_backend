import { AnswerType } from "../../QuestionVersion/entities/question-version.entity";

export interface QuestionOptionDto {
  id?: string;

  optionText: string;

  isCorrect?: boolean;
}

export interface CreateQuestionDto {
  questionText: string;

  answerType: AnswerType;

  options: QuestionOptionDto[];

  createdById: string;
}

export interface UpdateQuestionDto {
  questionText?: string;

  answerType?: AnswerType;

  options?: QuestionOptionDto[];

  isDeleted?: boolean;
}

export interface QuestionOutDto {
  id: string;

  createdById: string;

  questionText: string;

  answerType: AnswerType;

  versionNumber: number;

  options: QuestionOptionDto[];

  createdAt: Date;

  history?: Array<{
    versionNumber: number;
    questionText: string;
    answerType: AnswerType;
    createdAt: Date;
    options: QuestionOptionDto[];
  }>;
}
