import mongoose from 'mongoose'
import { z } from 'zod'

export const zObjectId = z
    .string()
    .refine((data) => mongoose.Types.ObjectId.isValid(data), {
        message: 'Invalid id',
    })

export const zCoordinateObject = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
})

export const zCoordinateArray = z
    .array(z.number())
    .length(2)
    .refine(
        (data) =>
            data[0] >= -180 &&
            data[0] <= 180 &&
            data[1] >= -90 &&
            data[1] <= 90,
        'Longitude(first position) must be between -180 and 180, Latitude(second position) must be between -90 and 90'
    )
