// src/domains/User/validator/user.validator.ts

import Joi from "joi";

import { UserRole } from "../entities/user.entity";

export const createUserValidationSchema =
  Joi.object({
    name:
      Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
          "string.empty":
            "Name is required",

          "string.min":
            "Name must be at least 3 characters",

          "any.required":
            "Name is required",
        }),

    email:
      Joi.string()
        .email()
        .required()
        .messages({
          "string.email":
            "Invalid email",

          "string.empty":
            "Email is required",

          "any.required":
            "Email is required",
        }),

    password:
      Joi.string()
        .min(6)
        .required()
        .messages({
          "string.min":
            "Password must be at least 6 characters",

          "string.empty":
            "Password is required",

          "any.required":
            "Password is required",
        }),

    role:
      Joi.string()
        .valid(
          UserRole.ADMIN,
          UserRole.USER,
        )
        .optional(),
  });

export const updateUserValidationSchema =
  Joi.object({
    name:
      Joi.string()
        .min(3)
        .max(100),

    email:
      Joi.string()
        .email(),

    password:
      Joi.string()
        .min(6),

    role:
      Joi.string().valid(
        UserRole.ADMIN,
        UserRole.USER,
      ),
  }).min(1);