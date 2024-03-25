import { BaseError } from './BaseError'

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super({
            message,
            statusCode: 404,
            errorCode: 'not_found',
        })
    }
}
