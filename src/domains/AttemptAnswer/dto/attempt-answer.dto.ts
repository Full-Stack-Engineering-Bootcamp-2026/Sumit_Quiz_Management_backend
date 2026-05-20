/**
 * Output DTO — shape returned to the client
 */
export interface AttemptAnswerOutDto {
  id: string;

  attemptId: string;

  questionId: string;

  questionVersionId: string;

  answerText?: string;

  selectedOptions: string[];
}

/**
 * Create DTO — fields required to create a new resource
 */
export interface CreateAttemptAnswerDto {
  attemptId: string;

  questionId: string;

  questionVersionId: string;

  answerText?: string;

  selectedOptions?: string[];
}

/**
 * Update DTO — all fields optional for partial update
 */
export interface UpdateAttemptAnswerDto {
  answerText?: string;

  selectedOptions?: string[];
}
