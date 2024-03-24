import { Router } from 'express'
import UserService from '../services/user.service'
import UserController from '../controllers/user.controller'
import { UserModel } from '../models'

const router = Router()

const model = UserModel
const service = new UserService(model)
const controller = new UserController(service)

const basePath = '/users'

router.get(basePath, controller.getAll)

router.post(basePath, controller.create)

router.get(`${basePath}/:id`, controller.getOne)

router.put(`${basePath}/:id`, controller.update)

export default router
