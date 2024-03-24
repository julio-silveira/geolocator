import { z } from 'zod'
import { zCoordinateArray, zObjectId } from './zodCustomTypes'

export const regionSchema = z.object({
    name: z.string().min(2).max(255),
    type: z.literal('Polygon', {
        invalid_type_error: 'Region type must be Polygon',
    }),
    coordinates: z.array(zCoordinateArray),
    user: zObjectId,
})

export const createRegionSchema = z.object({
    body: regionSchema,
})

export const updateRegionSchema = z.object({
    params: z.object({ id: zObjectId }),
    body: regionSchema.partial(),
})

export type RegionSchema = z.infer<typeof regionSchema>

export type CreateRegionSchema = z.infer<typeof createRegionSchema>

export type UpdateRegionSchema = z.infer<typeof updateRegionSchema>
