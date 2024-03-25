import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response, NextFunction } from 'express'
import { BaseError } from '../errors/BaseError'
import errorMiddleware from './errors'

describe('Error Middleware', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: sinon.SinonSpy

    beforeEach(() => {
        req = {}
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        }
        next = sinon.spy()
    })

    it('should handle BaseError', () => {
        const baseError = new BaseError({
            message: 'Test BaseError',
            errorCode: 'test_code',
            statusCode: 400,
        })

        errorMiddleware(baseError, req as Request, res as Response, next)

        expect((res.status as any).calledWith(400)).to.be.true
        expect(
            (res.json as any).calledWith({
                message: 'Test BaseError',
                errorCode: 'test_code',
                error: undefined,
            })
        ).to.be.true
        expect(next.called).to.be.false
    })

    it('should handle non-BaseError', () => {
        const nonBaseError = new Error('Test Error')

        errorMiddleware(nonBaseError, req as Request, res as Response, next)

        expect((res.status as any).calledWith(500)).to.be.true
        expect(
            (res.json as any).calledWith({
                message: 'Test Error',
                errorCode: 'internal_server_error',
                error: sinon.match.string,
            })
        ).to.be.true
        expect(next.called).to.be.false
    })
})
