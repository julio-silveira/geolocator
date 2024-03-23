import mongoose from 'mongoose'
import { z } from 'zod'

export const userSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    address: z.string().min(2).max(255).optional(),
    coordinates: z
        .object({
            latitude: z.number().min(-90).max(90),
            longitude: z.number().min(-180).max(180),
        })
        .optional(),
})

export const createUserSchema = z.object({
    body: userSchema.refine(
        (data) => !!data?.address !== !!data?.coordinates,
        'You need provide address OR coordinates, neither both or none of them'
    ),
})

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().refine((data) => mongoose.Types.ObjectId.isValid(data), {
            message: 'Invalid id',
        }),
    }),
    body: userSchema
        .partial()
        .refine(
            (data) => !(!!data?.address && !!data?.coordinates),
            'You only can provide address OR coordinates, neither both'
        ),
})

export type UserSchema = z.infer<typeof userSchema>

export type CreateUserSchema = z.infer<typeof createUserSchema>

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
