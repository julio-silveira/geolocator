import type { Request } from "express";
import { AnyZodObject, ZodError, z } from "zod";

export async function zodParser<T extends AnyZodObject>(
	schema: T,
	req: Request,
): Promise<z.infer<T>> {
	try {
		const parsedData = await schema.parseAsync(req);
		return parsedData;
	} catch (error) {
		if (error instanceof ZodError) {
			throw new Error(error.errors.map((err) => err.message).join(", "));
		}
		throw error;
	}
}