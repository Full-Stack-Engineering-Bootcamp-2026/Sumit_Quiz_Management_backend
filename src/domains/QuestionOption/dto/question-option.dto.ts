export interface QuestionOptionOutDto {
  id: string;

  questionVersionId: string;

  optionText: string;

  createdAt: Date;
}

export interface CreateQuestionOptionDto {
  questionVersionId: string;

  optionText: string;
}

export interface UpdateQuestionOptionDto {
  optionText?: string;
}