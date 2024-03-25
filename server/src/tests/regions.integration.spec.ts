import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chai, { expect } from 'chai'
import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { GeoLib } from '../utils/lib'
import app from '../app'
import {
    createFakeCoordinates,
    createRegionOnDatabase,
    createUserOnDatabase,
} from './testUtils'
import { MongoMemoryServer } from 'mongodb-memory-server'

chai.use(sinonChai)
let mongoServer

describe('Testing regions route', function () {
    before(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    after(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
        sinon.restore()
    })

    afterEach(async () => {
        sinon.restore()
    })

    it('GET /regions', async function () {
        await createRegionOnDatabase()
        await createRegionOnDatabase()

        const response = await supertest(app).get('/regions')
        expect(response).to.have.property('status', 200)
        expect(response.body).to.have.property('rows')
        expect(response.body).to.have.property('total')
    })

    it('GET /regions/:id', async function () {
        const region = await createRegionOnDatabase()
        const regionId = region._id.toString()

        const response = await supertest(app).get(`/regions/${regionId}`)

        expect(response).to.have.property('status', 200)
        expect(response.body).to.have.property('_id')
    })

    it('GET /regions/:id with invalid id', async function () {
        const response = await supertest(app).get(
            `/regions/${faker.database.mongodbObjectId()}`
        )

        expect(response).to.have.property('status', 404)
        expect(response.body).to.have.property('message')
    })

    it('PUT /regions/:id', async function () {
        const region = await createRegionOnDatabase()
        const response = await supertest(app)
            .put(`/regions/${region._id}`)
            .send({
                name: faker.location.city(),
            })

        expect(response).to.have.property('status', 201)
    })

    it('PUT /regions/:id with invalid id', async function () {
        const response = await supertest(app)
            .put(`/regions/${faker.database.mongodbObjectId()}`)
            .send({
                name: faker.location.city(),
            })

        expect(response).to.have.property('status', 404)
    })

    it('POST /regions', async function () {
        const user = await createUserOnDatabase()
        const coordinates = createFakeCoordinates()
        const newRegion = {
            name: faker.location.city(),
            type: 'Polygon',
            coordinates: [coordinates],
            user: user._id,
        }
        const response = await supertest(app).post('/regions').send(newRegion)

        expect(response).to.have.property('status', 201)
    })

    it('DELETE /regions/:id', async function () {
        const region = await createRegionOnDatabase()
        const response = await supertest(app).delete(`/regions/${region._id}`)

        expect(response).to.have.property('status', 204)
    })
})
