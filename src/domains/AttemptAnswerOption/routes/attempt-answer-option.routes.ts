import { Router } from "express";
import { Service } from "typedi";

import { AttemptAnswerOptionController } from "../controller/attempt-answer-option.controller";

import { authenticate } from "../../../common/middleware/authenticate.middleware";

import { validate } from "../../../common/middleware/validate.middleware";

import { asyncHandler } from "../../../common/utils/async-handler";

import { createAttemptAnswerOptionSchema } from "../validator/attempt-answer-option.validator";

@Service()
export class AttemptAnswerOptionRoutes {
  public router: Router;

  constructor(
    private readonly controller: AttemptAnswerOptionController,
  ) {
    this.router = Router();

    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.get(
      "/",
      authenticate,
      asyncHandler(
        this.controller.getAll.bind(
          this.controller,
        ),
      ),
    );

    this.router.get(
      "/:id",
      authenticate,
      asyncHandler(
        this.controller.getById.bind(
          this.controller,
        ),
      ),
    );

    this.router.post(
      "/",
      authenticate,
      validate(
        createAttemptAnswerOptionSchema,
      ),
      asyncHandler(
        this.controller.create.bind(
          this.controller,
        ),
      ),
    );

    this.router.delete(
      "/:id",
      authenticate,
      asyncHandler(
        this.controller.delete.bind(
          this.controller,
        ),
      ),
    );
  }
}