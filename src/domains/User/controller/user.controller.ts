import { Request, Response } from "express";

import { Service } from "typedi";

import { UserService } from "../service/user.service";

import { success } from "../../../Http_Response/response";

import { HttpStatus } from "../../../common/constants/http-status.constants";

@Service()
export class UserController {
  constructor(private readonly userService: UserService) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.login(req.body);

    res.status(HttpStatus.OK).json(success(result, "Login successful"));
  };

  
  public registerUser = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.registerUser(req.body);

    res
      .status(HttpStatus.CREATED)
      .json(success(result, "User registered successfully"));
  };


  public registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const result = await this.userService.registerAdmin(req.body);

    res
      .status(HttpStatus.CREATED)
      .json(success(result, "Admin registered successfully"));
  };


  public getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAllUsers();

    res
      .status(HttpStatus.OK)
      .json(success(users, "Users fetched successfully"));
  };


  public getUserByPublicId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.userService.getUserByPublicId(
    req.params.publicId as string
    );

    res
      .status(HttpStatus.OK)
      .json(success(result, "User fetched successfully"));
  };


  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    await this.userService.deleteUser(req.params.publicId as string);

    res.status(HttpStatus.OK).json(success(null, "User deleted successfully"));
  };
}
