import { Request, Response } from "express";
import { HTTP_STATUS } from "../utils/httpStatus";

export default class UserController {
   constructor(

   ) {}




 getUsers = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const [users, total] = await Promise.all([
    UserModel.find().lean(),
    UserModel.count(),
  ]);

  return res.json({
    rows: users,
    page,
    limit,
    total,
  });
});

getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Region not found' });
  }

  return user;
});

updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { update } = req.body;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.DEFAULT_ERROR).json({ message: 'Region not found' });
  }

  user.name = update.name;

  await user.save();

  return res.sendStatus(201);
});

}