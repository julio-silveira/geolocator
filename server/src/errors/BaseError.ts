import { StatusCodes } from "../utils/httpStatus";

export interface BaseErrorType extends Error {
	message: string;
	statusCode: StatusCodes;
	errorCode: string;
	error: Record<string, unknown>;
}

export class BaseError extends Error {
	public statusCode: StatusCodes;
	public errorCode: string;
	public error?: Record<string, unknown> | Record<string, unknown>[]  | undefined;

	constructor({
		message,
		statusCode,
		errorCode,
		error,
	}: {
		message: string;
		statusCode: StatusCodes;
		errorCode: string;
		error?: Record<string, unknown> | Record<string, unknown>[]  | undefined;
	}) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.error = error;
	}
}