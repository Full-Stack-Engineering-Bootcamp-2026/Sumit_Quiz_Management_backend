import { Request, Response } from "express";
import { Service } from "typedi";

import { QuizQuestionService } from "../service/quiz-question.service";

import {
  CreateQuizQuestionDto,
  UpdateQuizQuestionDto,
} from "../dto/quiz-question.dto";

import { HttpStatus } from "../../../common/constants/http-status.constants";

import { SuccessMessages } from "../../../common/constants/success-messages.constants";

import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class QuizQuestionController {
  constructor(
    private readonly service: QuizQuestionService,
  ) {}

  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this.service.getAll();

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
      data,
    });
  }

  public async create(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this.service.create(
        req.body as CreateQuizQuestionDto,
      );

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessages.CREATED,
      data,
    });
  }

  public async update(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this.service.update(
        req.params.id as string,
        req.body as UpdateQuizQuestionDto,
      );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: SuccessMessages.UPDATED,
      data,
    });
  }

  public async delete(
    req: Request,
    res: Response,
  ): Promise<Response> {
    await this.service.delete(
      req.params.id as string,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: SuccessMessages.DELETED,
    });
  }
}