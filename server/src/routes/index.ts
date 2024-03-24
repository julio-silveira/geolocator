import { Router } from 'express'
import userRoutes from './user.routes'
import regionRoutes from './region.routes'
const router = Router()

router.use('/', userRoutes)
router.use('/', regionRoutes)

export default router
