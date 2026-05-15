export interface QuizOutDto {
  id: string;

  title: string;

  createdById: string;

  createdAt: Date;
}

export interface CreateQuizDto {
  title: string;

  createdById: string;
}

export interface UpdateQuizDto {
  title?: string;
}