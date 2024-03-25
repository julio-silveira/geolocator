import { Request, Response } from 'express'
import { HTTP_STATUS } from '../utils/httpStatus'
import { zodParser } from '../utils/ZodParser'
import { BadRequestError } from '../errors/BadRequestError'
import RegionService from '../services/region.service'
import {
    createRegionSchema,
    getByDistanceSchema,
    getRegionsByPointSchema,
    updateRegionSchema,
} from '../schemas/region.schema'
import { NotFoundError } from "../errors/NotFoundError"
import UserService from "../services/user.service"

export default class RegionController {
    constructor(private readonly regionService: RegionService,
      private readonly userService: UserService) {}

    create = async (req: Request, res: Response) => {
        const { body } = await zodParser(createRegionSchema, req)

          const user = await this.userService.getUser(body.user)

          if (!user) {
              throw new NotFoundError('User not found')
          }

        const newUser = await this.regionService.create(body)

        return res.status(HTTP_STATUS.CREATED).json(newUser)
    }

    getAll = async (req: Request, res: Response) => {
        const { page, limit } = req.query

        const [rows, total] = await Promise.all([
            this.regionService.getAll(),
            this.regionService.getCount(),
        ])

        return res.status(HTTP_STATUS.OK).json({
            rows,
            page,
            limit,
            total,
        })
    }

    getOne = async (req: Request, res: Response) => {
        const { id } = req.params

        const region = await this.regionService.getOne(id)

        if (!region) {
            throw new NotFoundError('Region not found')
        }

        return res.status(HTTP_STATUS.OK).json(region)
    }

    getByPoint = async (req: Request, res: Response) => {
        const {
            query: { latitude, longitude },
        } = await zodParser(getRegionsByPointSchema, req)

        const region = await this.regionService.getByPoint({
            latitude,
            longitude,
        })

        if (!region) {
            throw new BadRequestError('Not found regions with this point')
        }

        return res.status(HTTP_STATUS.OK).json(region)
    }

    getByDistance = async (req: Request, res: Response) => {
        const {
            query: { latitude, longitude, distance, userToExclude },
        } = await zodParser(getByDistanceSchema, req)
        const region = await this.regionService.getByDistance({
            latitude,
            longitude,
            distance,
            userToExclude,
        })

        if (!region) {
            throw new BadRequestError('Not found regions with this distance')
        }

        return res.status(HTTP_STATUS.OK).json(region)
    }

    update = async (req: Request, res: Response) => {
        const {
            body,
            params: { id },
        } = await zodParser(updateRegionSchema, req)

        if (body.user) {
            const user = await this.userService.getUser(body.user)

            if (!user) {
                throw new NotFoundError('User not found')
            }
        }

        const isRegisteredRegion = await this.regionService.getOne(id)

        if (!isRegisteredRegion) {
            throw new NotFoundError('Region not found')
        }

        const region = await this.regionService.update(id, body)

        return res.status(HTTP_STATUS.CREATED).json(region)
    }

    delete = async (req: Request, res: Response) => {
        const { id } = req.params

        const region = await this.regionService.getOne(id)

        if (!region) {
            throw new BadRequestError('Region not found')
        }

        await this.regionService.delete(id)

        return res.status(HTTP_STATUS.NO_CONTENT).send()
    }
}
