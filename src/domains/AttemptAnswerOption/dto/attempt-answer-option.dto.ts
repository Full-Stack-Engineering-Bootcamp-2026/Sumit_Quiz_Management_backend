export interface AttemptAnswerOptionOutDto {
  id: string;

  attemptAnswerId: string;

  questionOptionId: string;
}

export interface CreateAttemptAnswerOptionDto {
  attemptAnswerId: string;

  questionOptionId: string;
}

export interface UpdateAttemptAnswerOptionDto {
  questionOptionId?: string;
}
