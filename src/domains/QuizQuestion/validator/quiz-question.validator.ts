import Joi from "joi";

export const createQuizQuestionSchema =
  Joi.object({
    quizId:
      Joi.string()
        .uuid()
        .required(),

    questionId:
      Joi.string()
        .uuid()
        .required(),

    questionVersionId:
      Joi.string()
        .uuid()
        .required(),
  });

export const updateQuizQuestionSchema =
  Joi.object({
    questionVersionId:
      Joi.string()
        .uuid(),
  }).min(1);