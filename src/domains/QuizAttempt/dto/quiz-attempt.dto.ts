export interface QuizAttemptOutDto {
  id: string;

  userId: string;

  quizId: string;

  attemptNumber: number;

  answers: {
    questionId: string;

    questionVersionId: string;

    answerText?: string;

    selectedOptionIds?: string[];
  }[];

  submittedAt: Date;
}

export interface CreateQuizAttemptDto {
  userId: string;

  quizId: string;

  answers: {
    questionVersionId: string;

    answerText?: string;

    selectedOptionIds?: string[];
  }[];
}

export interface UpdateQuizAttemptDto {}