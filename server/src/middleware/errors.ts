import { Request, Response, NextFunction } from 'express'
import { BaseError } from '../errors/BaseError'

const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof BaseError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
            error: error.error,
        })
    }
    const errorMessage = `
  ${req.method} ${req.path} - ${error}
  `
    console.error(error)
    return res.status(500).json({
        message: error.message,
        errorCode: 'internal_server_error',
        error: error.stack,
    })
}

export default errorMiddleware
