import { Router } from 'express'
import { RegionModel, UserModel } from '../models'
import RegionService from '../services/region.service'
import RegionController from '../controllers/region.controller'
import UserService from "../services/user.service"

const router = Router()

const model = RegionModel
const userModel = UserModel
const service = new RegionService(model)
const userService = new UserService(userModel)
const controller = new RegionController(service, userService)

const basePath = '/regions'

router.get(`${basePath}/by-point`, controller.getByPoint)

router.get(`${basePath}/by-distance`, controller.getByDistance)

router.get(basePath, controller.getAll)

router.post(basePath, controller.create)

router.get(`${basePath}/:id`, controller.getOne)

router.put(`${basePath}/:id`, controller.update)

router.delete(`${basePath}/:id`, controller.delete)

export default router
