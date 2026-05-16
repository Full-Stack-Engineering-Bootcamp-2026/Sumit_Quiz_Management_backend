import { Router } from "express";

import { Service } from "typedi";

import { UserController } from "../controller/user.controller";

import { loginValidationSchema } from "../validator/login.validation";

import { registerValidationSchema } from "../validator/register.validation";

import {
  validate,
  validateLogin,
} from "../../../common/middleware/validate.middleware";

import { asyncHandler } from "../../../common/utils/async-handler";

import { authenticate } from "../../../common/middleware/authenticate.middleware";

import { requireRole } from "../../../common/middleware/authorize.middleware";

import { UserRole } from "../entities/user.entity";

@Service()
export class UserRoutes {
  public router: Router;

  constructor(
    private readonly userController: UserController,
  ) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * Public Login Route
     */
    this.router.post(
      "/login",

      validateLogin(
        loginValidationSchema,
      ),

      asyncHandler(
        this.userController.login,
      ),
    );

    /**
     * Public User Registration
     */
    this.router.post(
      "/register/user",

      validate(
        registerValidationSchema,
      ),

      asyncHandler(
        this.userController
          .registerUser,
      ),
    );

    /**
     * Admin Only Registration
     */
    this.router.post(
      "/register/admin",

      authenticate,

      requireRole(
        UserRole.ADMIN,
      ),

      validate(
        registerValidationSchema,
      ),

      asyncHandler(
        this.userController
          .registerAdmin,
      ),
    );
  }
}