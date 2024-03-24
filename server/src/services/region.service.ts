import { RegionModel } from '../models'
import { RegionSchema } from '../schemas/region.schema'

export default class RegionService {
    constructor(private readonly regionModel: typeof RegionModel) {}

    public async create(data: RegionSchema) {
        const newRegion = await this.regionModel.create(data)
        return newRegion
    }

    public async getAll() {
        const regions = await this.regionModel.find().lean()

        return regions
    }

    public async getCount() {
        const count = await this.regionModel.count()

        return count
    }

    public async getOne(id: string) {
        const region = await this.regionModel.findOne({ _id: id }).lean()

        return region
    }

    public async getByPoint({ latitude, longitude }: { latitude: number, longitude: number} ) {
      const regions = await RegionModel.find({
        coordinates: {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          },
        },
      }).populate('user');

        return regions
    }

    public async update(id: string, data: RegionSchema) {
        const region = await this.regionModel.findOne({ _id: id })
        if (data?.name) {
            region.name = data.name
        }
        if (data?.type) {
            region.type = data.type
        }
        if (data?.coordinates) {
            region.coordinates = data.coordinates
        }

        await region.save()

        return region
    }
}
