export interface QuizAttemptOutDto {
  id: string;

  userId: string;

  quizId: string;

  attemptNumber: number;

  submittedAt: Date;
}

export interface CreateQuizAttemptDto {
  userId: string;

  quizId: string;

  attemptNumber: number;
}

export interface UpdateQuizAttemptDto {
  attemptNumber?: number;
}