import { Router } from "express";
import { UserModel } from "../models";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";

const router = Router();

const model = UserModel;
const service = new UserService(model);
const controller = new UserController(service);


router.get('/user', controller.getUsers);

router.get('/users/:id', controller.getUser);

router.put('/users/:id', controller.updateUser);


export default router;