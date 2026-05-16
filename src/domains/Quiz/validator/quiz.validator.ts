import Joi from "joi";

export const createQuizSchema =
  Joi.object({
    title:
      Joi.string()
        .trim()
        .required(),

    createdById:
      Joi.string()
        .uuid()
        .required(),

    questionVersionIds:
      Joi.array()
        .items(
          Joi.string().uuid(),
        )
        .min(1)
        .required(),
  });

export const updateQuizSchema =
  Joi.object({
    title:
      Joi.string()
        .trim(),

    questionVersionIds:
      Joi.array().items(
        Joi.string().uuid(),
      ),
  }).min(1);