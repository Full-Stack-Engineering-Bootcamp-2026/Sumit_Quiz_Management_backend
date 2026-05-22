export interface QuizAttemptOutDto {
  id: string;

  userId: string;

  quizId: string;

  attemptNumber: number;

  answers: {
    questionId: string;

    questionVersionId: string;

    questionText: string;

    answerType: string;

    answerText?: string;

    selectedOptionIds?: string[];

    selectedOptions?: {
      id: string;
      optionText: string;
      isCorrect: boolean;
    }[];
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
