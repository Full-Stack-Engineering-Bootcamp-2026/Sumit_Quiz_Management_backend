import Joi from "joi";

export const createQuestionSchema =
  Joi.object({
    createdById: Joi.string()
      .uuid()
      .required(),
  });

export const updateQuestionSchema =
  Joi.object({
    isDeleted:
      Joi.boolean(),
  }).min(1);