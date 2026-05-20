import { AnswerType } from "../../QuestionVersion/entities/question-version.entity";

export interface QuizQuestionDetailsDto {
  questionId: string;

  questionVersionId: string;

  versionNumber: number;

  questionText: string;

  answerType: AnswerType;

  options: {
    id: string;

    optionText: string;
  }[];
}

export interface QuizOutDto {
  id: string;

  title: string;

  createdById: string;

  questions: QuizQuestionDetailsDto[];

  createdAt: Date;
}

export interface CreateQuizDto {
  title: string;

  createdById: string;

  questionVersionIds: string[];
}

export interface UpdateQuizDto {
  title?: string;

  questionVersionIds?: string[];
}