import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
	constructor(message: string) {
		super({
			message,
			statusCode: 400,
			errorCode: "bad_request",
		});
	}
}