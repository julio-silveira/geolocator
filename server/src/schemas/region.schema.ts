import { z } from 'zod'
import { zCoordinateArray, zObjectId } from './zodCustomTypes'

export const regionSchema = z.object({
    name: z.string().min(2).max(255),
    type: z.literal('Polygon', {
        invalid_type_error: 'Region type must be Polygon',
    }),
    coordinates: z.array(zCoordinateArray).min(4, "Polygons must have at least four coordinates")
    .refine(
        value => {
            const firstCoordinate = value[0]
            const lastCoordinate = value[value.length - 1]
            return firstCoordinate[0] === lastCoordinate[0] && firstCoordinate[1] === lastCoordinate[1]
        },
        {
            message: "First and last coordinates must be the same",
        }
    ).refine(
        value => {
            const withoutLast = value.slice(0, value.length - 1)
            const hasDuplicates = withoutLast.some((coordinate, index) => {
                return withoutLast.slice(index + 1).some(otherCoordinate => {
                    return coordinate[0] === otherCoordinate[0] && coordinate[1] === otherCoordinate[1]
                })
            }
            )
            return !hasDuplicates
        },
        {
            message: "Coordinates must not have duplicates, except for the first and last coordinates",
        }
    ),
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
