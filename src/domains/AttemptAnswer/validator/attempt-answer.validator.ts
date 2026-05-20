import Joi from "joi";

export const createAttemptAnswerSchema = Joi.object({
  attemptId: Joi.string().uuid().required(),

  questionId: Joi.string().uuid().required(),

  questionVersionId: Joi.string().uuid().required(),

  answerText: Joi.string().allow("").optional(),

  selectedOptions: Joi.array().items(Joi.string().uuid()).optional(),
});

export const updateAttemptAnswerSchema = Joi.object({
  answerText: Joi.string().allow("").optional(),

  selectedOptions: Joi.array().items(Joi.string().uuid()).optional(),
}).min(1);
