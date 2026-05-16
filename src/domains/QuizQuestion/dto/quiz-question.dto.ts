export interface QuizQuestionOutDto {
  id: string;

  quizId: string;

  questionId: string;

  questionVersionId: string;
}

export interface CreateQuizQuestionDto {
  quizId: string;

  questionId: string;

  questionVersionId: string;
}

export interface UpdateQuizQuestionDto {
  questionVersionId?: string;
}