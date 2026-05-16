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

    answers:
      Joi.array()
        .items(
          Joi.object({
            questionVersionId:
              Joi.string()
                .uuid()
                .required(),

            answerText:
              Joi.string()
                .allow(
                  "",
                  null,
                )
                .optional(),

            selectedOptionIds:
              Joi.array()
                .items(
                  Joi.string().uuid(),
                )
                .optional(),
          }),
        )
        .min(1)
        .required(),
  });