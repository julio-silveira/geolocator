import { expect } from 'chai'
import sinon from 'sinon'
import RegionService from './region.service'
import { RegionModel } from '../models'
import { RegionSchema } from '../schemas/region.schema'
import { Region } from '../models/region.model'
import { faker } from '@faker-js/faker'

const buildNewRegion = (): {
    regionData: RegionSchema
    savedRegion: Region
} => {
    const regionData: RegionSchema = {
        name: faker.company.name(),
        type: 'Polygon',
        coordinates: [
            [
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0],
            ],
        ],
        user: faker.database.mongodbObjectId(),
    }

    const savedRegion: Region = {
        _id: faker.database.mongodbObjectId(),
        name: regionData.name,
        location: {
            type: regionData.type,
            coordinates: regionData.coordinates,
        },
        user: regionData.user,
    }

    return { regionData, savedRegion }
}

describe('RegionService', () => {
    it('should create a new region', async () => {
        const regionModelMock = sinon.mock(RegionModel)
        const { regionData, savedRegion } = buildNewRegion()

        regionModelMock.expects('create').once().resolves(savedRegion)

        const regionService = new RegionService(RegionModel)
        const createdRegion = await regionService.create(regionData)

        expect(createdRegion).to.deep.equal(savedRegion)
        regionModelMock.verify()
        regionModelMock.restore()
    })

    it('should get all regions', async () => {
        const regions = [
            buildNewRegion().savedRegion,
            buildNewRegion().savedRegion,
        ]

        const regionModelMock = sinon.mock(RegionModel)
        regionModelMock.expects('find').once().resolves(regions)

        const regionService = new RegionService(RegionModel)
        const fetchedRegions = await regionService.getAll()

        expect(fetchedRegions).to.deep.equal(regions)
        regionModelMock.verify()
        regionModelMock.restore()
    })

    it('should return the count of regions', async () => {
        const regionCount = 5
        const countStub = sinon.stub().returns(regionCount)

        const regionModelMock = sinon.mock(RegionModel)
        regionModelMock.expects('count').once().resolves(countStub())

        const regionService = new RegionService(RegionModel)
        const fetchedCount = await regionService.getCount()

        expect(fetchedCount).to.equal(regionCount)
        regionModelMock.verify()
        regionModelMock.restore()
    })

    it('should get a region by ID', async () => {
        const { savedRegion } = buildNewRegion()
        const regionModelMock = sinon.mock(RegionModel)
        regionModelMock.expects('findOne').resolves(savedRegion)

        const regionService = new RegionService(RegionModel)
        const fetchedRegion = await regionService.getOne(
            savedRegion._id.toString()
        )

        expect(fetchedRegion).to.deep.equal(savedRegion)
        regionModelMock.verify()
        regionModelMock.restore()
    })

    it('should update region data', async () => {
        const { regionData, savedRegion } = buildNewRegion()

        const regionStub = sinon.stub().resolves(savedRegion)
        const regionModelMock = sinon.mock(RegionModel)
        regionModelMock
            .expects('findOne')
            .resolves({ ...savedRegion, save: regionStub })

        const regionService = new RegionService(RegionModel)
        const updatedRegionData = await regionService.update(
            savedRegion._id.toString(),
            regionData
        )

        expect(updatedRegionData.name).to.equal(regionData.name)
        expect(updatedRegionData.location).to.deep.equal({
            type: regionData.type,
            coordinates: regionData.coordinates,
        })

        regionModelMock.verify()
        regionModelMock.restore()
    })

    it('should delete a region by ID', async () => {
        const { savedRegion } = buildNewRegion()
        const regionModelMock = sinon.mock(RegionModel)
        regionModelMock.expects('deleteOne').resolves()

        const regionService = new RegionService(RegionModel)
        await regionService.delete(savedRegion._id.toString())

        regionModelMock.verify()
        regionModelMock.restore()
    })
})
