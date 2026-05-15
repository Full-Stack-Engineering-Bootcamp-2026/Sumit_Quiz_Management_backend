import Joi from "joi";

export const createQuestionOptionSchema =
  Joi.object({
    questionVersionId:
      Joi.string()
        .uuid()
        .required(),

    optionText:
      Joi.string()
        .required(),
  });

export const updateQuestionOptionSchema =
  Joi.object({
    optionText:
      Joi.string(),
  }).min(1);