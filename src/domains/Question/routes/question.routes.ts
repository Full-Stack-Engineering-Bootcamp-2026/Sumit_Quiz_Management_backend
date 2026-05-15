import { Router } from "express";
import { Service } from "typedi";

import { QuestionController } from "../controller/question.controller";

import { authenticate } from "../../../common/middleware/authenticate.middleware";

import { validate } from "../../../common/middleware/validate.middleware";

import { asyncHandler } from "../../../common/utils/async-handler";

import {
  createQuestionSchema,
  updateQuestionSchema,
} from "../validator/question.validator";

@Service()
export class QuestionRoutes {
  public router: Router;

  constructor(
    private readonly controller: QuestionController,
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
        createQuestionSchema,
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
        updateQuestionSchema,
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