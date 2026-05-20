import Joi from "joi";

export const createQuestionSchema = Joi.object({
  questionText: Joi.string().trim().required(),

  answerType: Joi.string()
    .valid("single_select", "multi_select", "text")
    .required(),

  options: Joi.array()
    .items(
      Joi.object({
        optionText: Joi.string().trim().required(),

        isCorrect: Joi.boolean().optional(),
      }),
    )
    .when("answerType", {
      is: "text",
      then: Joi.array().optional().default([]),
      otherwise: Joi.array().min(1).required(),
    }),
});

export const updateQuestionSchema = Joi.object({
  questionText: Joi.string().trim().optional(),

  answerType: Joi.string()
    .valid("single_select", "multi_select", "text")
    .optional(),

  options: Joi.array()
    .items(
      Joi.object({
        optionText: Joi.string().trim().required(),

        isCorrect: Joi.boolean().optional(),
      }),
    )
    .optional(),

  isDeleted: Joi.boolean().optional(),
}).min(1);
