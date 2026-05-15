import { Request, Response } from "express";
import { Service } from "typedi";

import { AttemptAnswerOptionService } from "../service/attempt-answer-option.service";

import { CreateAttemptAnswerOptionDto } from "../dto/attempt-answer-option.dto";

import { HttpStatus } from "../../../common/constants/http-status.constants";

import { SuccessMessages } from "../../../common/constants/success-messages.constants";

import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class AttemptAnswerOptionController {
  constructor(
    private readonly service: AttemptAnswerOptionService,
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
        req.body as CreateAttemptAnswerOptionDto,
      );

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessages.CREATED,
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