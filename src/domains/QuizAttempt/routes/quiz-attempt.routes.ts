import { Router } from "express";
import { Service } from "typedi";

import { QuizAttemptController } from "../controller/quiz-attempt.controller";

import { authenticate } from "../../../common/middleware/authenticate.middleware";

import { validate } from "../../../common/middleware/validate.middleware";

import { asyncHandler } from "../../../common/utils/async-handler";

import { createQuizAttemptSchema, updateQuizAttemptSchema } from "../validator/quiz-attempt.validator";

@Service()
export class QuizAttemptRoutes {
  public router: Router;

  constructor(
    private readonly controller: QuizAttemptController,
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
        createQuizAttemptSchema,
      ),
      asyncHandler(
        this.controller.create.bind(
          this.controller,
        ),
      ),
    );

    this.router.put(
      "/:id",
      authenticate,
      validate(
        updateQuizAttemptSchema,
      ),
      asyncHandler(
        this.controller.update.bind(
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