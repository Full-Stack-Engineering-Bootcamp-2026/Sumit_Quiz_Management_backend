import Joi from "joi";

export const createQuizSchema =
  Joi.object({
    title:
      Joi.string()
        .required(),

    createdById:
      Joi.string()
        .uuid()
        .required(),
  });

export const updateQuizSchema =
  Joi.object({
    title:
      Joi.string(),
  }).min(1);