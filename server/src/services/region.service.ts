import { RegionModel } from '../models'
import { RegionSchema } from '../schemas/region.schema'

export default class RegionService {
    constructor(private readonly regionModel: typeof RegionModel) {}

    public async create(data: RegionSchema) {
        const newRegion = await this.regionModel.create({
            name: data.name,
            location: {
                type: data.type,
                coordinates: data.coordinates,
            },
            user: data.user,
        })
        return newRegion
    }

    public async getAll() {
        const regions = await this.regionModel.find()

        return regions
    }

    public async getCount() {
        const count = await this.regionModel.count()

        return count
    }

    public async getOne(id: string) {
        const region = await this.regionModel.findOne({ _id: id })

        return region
    }

    public async getByPoint({
        latitude,
        longitude,
    }: {
        latitude: number
        longitude: number
    }) {
        const regions = await RegionModel.find({
            location: {
                $geoIntersects: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                },
            },
        })

        return regions
    }

    public async getByDistance({
        latitude,
        longitude,
        distance,
        userToExclude,
    }: {
        latitude: number
        longitude: number
        distance: number
        userToExclude?: string
    }) {
        const regions = await RegionModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: distance,
                },
            },
            user: {
                $ne: userToExclude,
            },
        })

        return regions
    }

    public async update(id: string, data: RegionSchema) {
        const region = await this.regionModel.findOne({ _id: id })
        if (data?.name) {
            region.name = data.name
        }

        if (data?.coordinates) {
            region.location = {
                type: data.type,
                coordinates: data.coordinates,
            }
        }

        await region.save()

        return region
    }

    async delete(id: string) {
        await this.regionModel.deleteOne({ _id: id })
    }
}
