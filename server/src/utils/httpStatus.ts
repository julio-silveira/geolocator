export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    UPDATED: 201,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    DEFAULT_ERROR: 418,
} as const

export type StatusCodes = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]
