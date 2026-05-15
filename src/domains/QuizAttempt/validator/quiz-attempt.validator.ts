import Joi from "joi";

export const createQuizAttemptSchema =
  Joi.object({
    userId:
      Joi.string()
        .uuid()
        .required(),

    quizId:
      Joi.string()
        .uuid()
        .required(),

    attemptNumber:
      Joi.number()
        .required(),
  });

export const updateQuizAttemptSchema =
  Joi.object({
    attemptNumber:
      Joi.number(),
  }).min(1);