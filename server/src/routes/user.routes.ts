import { Router } from 'express'
import UserService from '../services/user.service'
import UserController from '../controllers/user.controller'
import { UserModel } from '../models'

const router = Router()

const model = UserModel
const service = new UserService(model)
const controller = new UserController(service)

router.get('/users', controller.getUsers)

router.post('/users', controller.createUser)

router.get('/users/:id', controller.getUser)

router.put('/users/:id', controller.updateUser)

export default router
