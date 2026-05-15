import Joi from "joi";

export const createAttemptAnswerOptionSchema =
  Joi.object({
    attemptAnswerId: Joi.string()
      .uuid()
      .required(),

    questionOptionId: Joi.string()
      .uuid()
      .required(),
  });