import { Request, Response } from 'express'
import { HTTP_STATUS } from '../utils/httpStatus'
import UserService from '../services/user.service'
import { zodParser } from '../utils/ZodParser'
import { createUserSchema, updateUserSchema } from '../schemas/user.schemas'
import { BadRequestError } from '../errors/BadRequestError'
import { NotFoundError } from "../errors/NotFoundError"

export default class UserController {
    constructor(private readonly userService: UserService) {}

    create = async (req: Request, res: Response) => {
        const { body } = await zodParser(createUserSchema, req)

        const isEmailTaken = await this.userService.getUserByEmail(body.email)

        if (isEmailTaken) {
            throw new BadRequestError('Email already taken')
        }

        const newUser = await this.userService.createUser(body)

        return res.status(HTTP_STATUS.CREATED).json(newUser)
    }

    getAll = async (req: Request, res: Response) => {
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

    getOne = async (req: Request, res: Response) => {
        const { id } = req.params

        const user = await this.userService.getUser(id)

        if (!user) {
           throw new NotFoundError('User not found')
        }

        return res.status(HTTP_STATUS.OK).json(user)
    }

    update = async (req: Request, res: Response) => {
        const {
            body,
            params: { id },
        } = await zodParser(updateUserSchema, req)

        const isRegisteredUser = await this.userService.getUser(id)

        if (!isRegisteredUser) {
            throw new BadRequestError('User not found')
        }

        const userWithEmail = await this.userService.getUserByEmail(body.email)

        if (userWithEmail && userWithEmail._id.toString() !== id) {
            throw new BadRequestError('New email already taken')
        }

        const user = await this.userService.updateUser(id, body)

        return res.status(HTTP_STATUS.CREATED).json(user)
    }
}
