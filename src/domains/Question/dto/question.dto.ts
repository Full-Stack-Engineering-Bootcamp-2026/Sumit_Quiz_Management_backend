export interface QuestionOutDto {
  id: string;

  createdById: string;

  isDeleted: boolean;

  createdAt: Date;
}

export interface CreateQuestionDto {
  createdById: string;
}

export interface UpdateQuestionDto {
  isDeleted?: boolean;
}