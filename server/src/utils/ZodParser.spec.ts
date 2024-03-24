import { expect } from 'chai';
import sinon from 'sinon';
import { z } from 'zod';
import { BaseError } from '../errors/BaseError';
import { HTTP_STATUS } from './httpStatus';
import { zodParser } from "./ZodParser";

describe('zodParser', () => {
    it('should parse valid data', async () => {
        const req = {
                id: 1,
                name: 'John Doe',
        };

        const schema = z.object({
            id: z.number(),
            name: z.string(),
        });

        const parsedData = await zodParser(schema, req as any);
        expect(parsedData).to.deep.equal(req);
    });

    it('should throw validation error for invalid data', async () => {
        const req = {
            body: { // Mocked request object with invalid data
                id: 'not_a_number',
                name: 'John Doe',
            },
        };

        const schema = z.object({
            id: z.number(),
            name: z.string(),
        });

        try {
            await zodParser(schema, req as any);
            expect.fail('Expected zodParser to throw error');
        } catch (error) {
            expect(error).to.be.instanceOf(BaseError);
            expect(error.statusCode).to.equal(HTTP_STATUS.UNPROCESSABLE_ENTITY);
            expect(error.errorCode).to.equal('validation_error');
            expect(error.error).to.be.an('array').that.is.not.empty;
        }
    });

    it('should throw internal server error for unexpected error', async () => {
        const req = {
            body: { id: 1 },
        };

        const schema = z.object({
            id: z.number(),
        });

        const parseAsyncStub = sinon.stub(schema, 'parseAsync');
        parseAsyncStub.rejects(new Error('Some unexpected error'));

        try {
            await zodParser(schema, req as any);
            expect.fail('Expected zodParser to throw error');
        } catch (error) {
            expect(error).to.be.instanceOf(BaseError);
            expect(error.statusCode).to.equal(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            expect(error.errorCode).to.equal('internal_server_error');
            expect(error.error).to.be.an('object').that.is.empty;
        }

        parseAsyncStub.restore();
    });
});
