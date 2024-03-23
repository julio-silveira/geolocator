import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  address: z.string().min(2).max(255).optional(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
}).refine(data => {
  if (!data?.address && !data?.coordinates) {
    return false;
  }
}, "You need provide address or coordinates")
.refine(data => {
  if (data?.address && data?.coordinates) {
    return false;
  }
}, "You need provide address or coordinates, never both")


export const createUserSchema = z.object({
	body: userSchema,
});

export type UserSchema = z.infer<typeof userSchema>;

export type CreateUserSchema = z.infer<typeof createUserSchema>;