import { Router } from 'express'
import { RegionModel, UserModel } from '../models'
import RegionService from '../services/region.service'
import RegionController from '../controllers/region.controller'

const router = Router()

const model = RegionModel
const service = new RegionService(model)
const controller = new RegionController(service)

const basePath = '/regions'

router.get(basePath, controller.getAll)

router.post(basePath, controller.create)

router.get(`${basePath}/:id`, controller.getOne)

router.put(`${basePath}/:id`, controller.update)

export default router
