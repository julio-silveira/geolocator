import { z } from 'zod'
import { zCoordinateObject, zObjectId } from './zodCustomTypes'

export const userSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    address: z.string().min(2).max(255).optional(),
    coordinates: zCoordinateObject.optional(),
})

export const createUserSchema = z.object({
    body: userSchema.refine(
        (data) => !!data?.address !== !!data?.coordinates,
        'You need provide address OR coordinates, neither both or none of them'
    ),
})

export const updateUserSchema = z.object({
    params: z.object({
        id: zObjectId,
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
