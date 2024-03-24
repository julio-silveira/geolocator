import type { Request, } from 'express'
import { AnyZodObject, ZodError, z } from 'zod'
import { BaseError } from '../errors/BaseError'
import { HTTP_STATUS } from './httpStatus'

export async function zodParser<T extends AnyZodObject>(
    schema: T,
    req: Request
): Promise<z.infer<T>> {
    try {
        const parsedData = await schema.parseAsync(req)
        return parsedData
    } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.errors.map((err) => ({
                message: err.message,
                path: err.path.join('.'),
            }))
            throw new BaseError({
                message: 'Validation failed',
                statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                errorCode: 'validation_error',
                error: errors,
            })
        }
        throw new BaseError({
            message: 'Internal server error',
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            errorCode: 'internal_server_error',
            error: {},
        })
    }
}
