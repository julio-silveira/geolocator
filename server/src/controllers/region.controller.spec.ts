import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response } from 'express'
import { BadRequestError } from '../errors/BadRequestError'
import RegionController from './region.controller'
import { faker } from '@faker-js/faker'

describe('RegionController', () => {
    let regionServiceMock
    let regionController: RegionController

    beforeEach(() => {
        regionServiceMock = {
            create: sinon.stub(),
            getAll: sinon.stub(),
            getCount: sinon.stub(),
            getOne: sinon.stub(),
            getByPoint: sinon.stub(),
            getByDistance: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub(),
        }

        regionController = new RegionController(regionServiceMock)
    })

    it('should create a region', async () => {
        const req = {
            body: {
                name: 'Test Region',
                type: 'Polygon',
                coordinates: [
                    [
                        [0, 0],
                        [3, 6],
                        [6, 1],
                        [0, 0],
                    ],
                ],
                user: faker.database.mongodbObjectId(),
            },
        } as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        regionServiceMock.create.resolves({ name: 'Test Region' })

        await regionController.create(req, res)

        expect((res.status as any).calledWith(201)).to.be.true
        expect((res.json as any).calledWith({ name: 'Test Region' })).to.be.true
    })

    it('should return all regions', async () => {
        const req = { query: {} } as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockRegions = [{ name: 'Region 1' }, { name: 'Region 2' }]
        const mockCount = 2

        regionServiceMock.getAll.resolves(mockRegions)
        regionServiceMock.getCount.resolves(mockCount)

        await regionController.getAll(req, res)

        expect((res.status as any).calledWith(200)).to.be.true
        expect(
            (res.json as any).calledWith({
                rows: mockRegions,
                total: mockCount,
                page: undefined,
                limit: undefined,
            })
        ).to.be.true
    })

    it('should return a region by id', async () => {
        const req = {
            params: { id: faker.database.mongodbObjectId },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockRegion = { name: 'Region 1' }

        regionServiceMock.getOne.resolves(mockRegion)

        await regionController.getOne(req, res)

        expect((res.status as any).calledWith(200)).to.be.true
        expect((res.json as any).calledWith(mockRegion)).to.be.true
    })

    it('should return a region by point', async () => {
        const req = {
            query: { latitude: 0, longitude: 0 },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockRegion = { name: 'Region 1' }

        regionServiceMock.getByPoint.resolves(mockRegion)

        await regionController.getByPoint(req, res)

        expect((res.status as any).calledWith(200)).to.be.true
        expect((res.json as any).calledWith(mockRegion)).to.be.true
    })

    it('should return a region by distance', async () => {
        const req = {
            query: { latitude: 0, longitude: 0, distance: 100 },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockRegion = { name: 'Region 1' }

        regionServiceMock.getByDistance.resolves(mockRegion)

        await regionController.getByDistance(req, res)

        expect((res.status as any).calledWith(200)).to.be.true
        expect((res.json as any).calledWith(mockRegion)).to.be.true
    })

    it('should update a region', async () => {
        const req = {
            params: { id: faker.database.mongodbObjectId() },
            body: { name: 'Test Region' },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockRegion = { name: 'Test Region' }
        regionServiceMock.getOne.resolves(mockRegion)
        regionServiceMock.update.resolves(mockRegion)

        await regionController.update(req, res)

        expect((res.status as any).calledWith(201)).to.be.true
        expect((res.json as any).calledWith(mockRegion)).to.be.true
    })

    it('should delete a region', async () => {
        const req = {
            params: { id: faker.database.mongodbObjectId() },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            send: sinon.stub(),
        } as unknown as Response

        const mockRegion = { name: 'Test Region' }
        regionServiceMock.getOne.resolves(mockRegion)
        regionServiceMock.delete.resolves()

        await regionController.delete(req, res)

        expect((res.status as any).calledWith(204)).to.be.true
    })
})
