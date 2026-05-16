import { Router } from "express";

import { Service } from "typedi";

import { QuestionVersionController } from "../controller/question-version.controller";

import { authenticate } from "../../../common/middleware/authenticate.middleware";

import { asyncHandler } from "../../../common/utils/async-handler";

@Service()
export class QuestionVersionRoutes {
  public router: Router;

  constructor(
    private readonly controller: QuestionVersionController,
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
  }
}