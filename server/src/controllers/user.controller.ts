import { Request, Response } from "express";
import { HTTP_STATUS } from "../utils/httpStatus";
import UserService from "../services/user.service";

export default class UserController {
   constructor(
    private readonly userService: UserService,
   ) {}

 getUsers = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const [
    users,
    total,
  ] = await Promise.all([
    this.userService.getUsers(),
    this.userService.getUsersCount(),
  ]);

  
  return res.json({
    rows: users,
    page,
    limit,
    total
  });
}

getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await this.userService.getUser(id);
  if (!user) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Region not found' });
  }

  return user;
}

updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { update } = req.body;

  await this.userService.updateUser(id, update);

  return res.sendStatus(201);
}

}