import { Request, Response } from 'express'
import { HTTP_STATUS } from '../utils/httpStatus'
import { zodParser } from '../utils/ZodParser'
import { BadRequestError } from '../errors/BadRequestError'
import RegionService from '../services/region.service'
import {
    createRegionSchema,
    updateRegionSchema,
} from '../schemas/region.schema'

export default class RegionController {
    constructor(private readonly regionService: RegionService) {}

    create = async (req: Request, res: Response) => {
        const { body } = await zodParser(createRegionSchema, req)

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
            throw new BadRequestError('Region not found')
        }

        return res.status(HTTP_STATUS.OK).json(region)
    }

    update = async (req: Request, res: Response) => {
        const {
            body,
            params: { id },
        } = await zodParser(updateRegionSchema, req)

        const isRegisteredRegion = await this.regionService.getOne(id)

        if (!isRegisteredRegion) {
            throw new BadRequestError('Region not found')
        }

        const region = await this.regionService.update(id, body)

        return res.status(HTTP_STATUS.CREATED).json(region)
    }
}