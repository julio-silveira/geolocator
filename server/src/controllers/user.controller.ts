import { Request, Response } from 'express'
import { HTTP_STATUS } from '../utils/httpStatus'
import UserService from '../services/user.service'
import { zodParser } from '../utils/ZodParser'
import { createUserSchema, updateUserSchema } from '../schemas/user.schemas'

export default class UserController {
    constructor(private readonly userService: UserService) {}

    createUser = async (req: Request, res: Response) => {
        const { body } = await zodParser(createUserSchema, req)
        const newUser = await this.userService.createUser(body)

        return res.status(HTTP_STATUS.CREATED).json(newUser)
    }

    getUsers = async (req: Request, res: Response) => {
        const { page, limit } = req.query

        const [users, total] = await Promise.all([
            this.userService.getUsers(),
            this.userService.getUsersCount(),
        ])

        return res.status(HTTP_STATUS.OK).json({
            rows: users,
            page,
            limit,
            total,
        })
    }

    getUser = async (req: Request, res: Response) => {
        const { id } = req.params

        const user = await this.userService.getUser(id)
        if (!user) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Region not found',
            })
        }

        return user
    }

    updateUser = async (req: Request, res: Response) => {
      const { body, params:{id} } = await zodParser(updateUserSchema, req)

        const user = await this.userService.updateUser(id, body)

        return res.status(HTTP_STATUS.CREATED).json(user)
    }
}
