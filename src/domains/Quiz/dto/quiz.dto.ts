export interface QuizOutDto {
  id: string;

  title: string;

  createdById: string;

  questions: {
    questionId: string;

    questionVersionId: string;
  }[];

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