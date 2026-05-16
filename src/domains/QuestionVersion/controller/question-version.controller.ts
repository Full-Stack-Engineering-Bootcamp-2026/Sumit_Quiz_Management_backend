import {
  Request,
  Response,
} from "express";

import { Service } from "typedi";

import { QuestionVersionService } from "../service/question-version.service";

import { HttpStatus } from "../../../common/constants/http-status.constants";

import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class QuestionVersionController {
  constructor(
    private readonly service: QuestionVersionService,
  ) {}

  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this.service.getAll();

    return generateResponse(res, {
      statusCode:
        HttpStatus.OK,

      data,
    });
  }

  public async getById(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this.service.getById(
        req.params.id as string,
      );

    return generateResponse(res, {
      statusCode:
        HttpStatus.OK,

      data,
    });
  }
}