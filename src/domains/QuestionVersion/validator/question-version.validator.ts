import Joi from "joi";

import { AnswerType } from "../entities/question-version.entity";

export const createQuestionVersionSchema =
  Joi.object({
    questionId:
      Joi.string()
        .uuid()
        .required(),

    questionText:
      Joi.string()
        .required(),

    answerType:
      Joi.string()
        .valid(
          AnswerType.SINGLE_SELECT,
          AnswerType.MULTI_SELECT,
          AnswerType.TEXT,
        )
        .required(),

    versionNumber:
      Joi.number()
        .required(),
  });

export const updateQuestionVersionSchema =
  Joi.object({
    questionText:
      Joi.string(),

    answerType:
      Joi.string().valid(
        AnswerType.SINGLE_SELECT,
        AnswerType.MULTI_SELECT,
        AnswerType.TEXT,
      ),

    isActive:
      Joi.boolean(),
  }).min(1);