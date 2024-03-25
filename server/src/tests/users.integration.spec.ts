import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chai, { expect } from 'chai'
import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { GeoLib } from '../utils/lib'
import app from '../app'
import { createFakeCoordinates, createUserOnDatabase } from './testUtils'
import { MongoMemoryServer } from 'mongodb-memory-server'

chai.use(sinonChai)
let mongoServer

describe('Testing users route', function () {
    let geocoderMock
    let geoLib: GeoLib

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

    beforeEach(async () => {
        geocoderMock = {
            reverse: sinon.stub(),
            geocode: sinon.stub(),
        }

        geoLib = new GeoLib(geocoderMock)
    })

    afterEach(async () => {
        sinon.restore()
    })

    it('GET /users', async function () {
        await createUserOnDatabase()
        await createUserOnDatabase()

        const response = await supertest(app).get('/users')
        expect(response).to.have.property('status', 200)
        expect(response.body).to.have.property('rows')
        expect(response.body).to.have.property('total')
    })

    it('GET /users/:id', async function () {
        const user = await createUserOnDatabase()

        const userId = user._id.toString()

        const response = await supertest(app).get(`/users/${userId}`)

        expect(response).to.have.property('status', 200)
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('name')
        expect(response.body).to.have.property('email')
        expect(response.body).to.have.property('address')
        expect(response.body).to.have.property('coordinates')
        expect(response.body).to.have.property('regions')
    })

    it('GET /users/:id with invalid id', async function () {
        const response = await supertest(app).get('/users/0')

        expect(response).to.have.property('status', 404)
        expect(response.body).to.have.property('message')
    })

    it('PUT /users/:id', async function () {
        const user = await createUserOnDatabase()
        const response = await supertest(app)
            .put(`/users/${user._id}`)
            .send({
                address: faker.location.streetAddress({ useFullAddress: true }),
            })

        expect(response).to.have.property('status', 201)
    })

    it('PUT /users/:id with invalid id', async function () {
        const response = await supertest(app)
            .put(`/users/${faker.database.mongodbObjectId()}`)
            .send({
                address: faker.location.streetAddress({ useFullAddress: true }),
            })

        expect(response).to.have.property('status', 404)
    })

    it('POST /users', async function () {
        const coordinates = createFakeCoordinates()

        const newUser = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress({ useFullAddress: true }),
        }

        const response = await supertest(app).post('/users').send(newUser)

        expect(response).to.have.property('status', 201)
    })

    it('DELETE /users/:id', async function () {
        const user = await createUserOnDatabase()
        const response = await supertest(app).delete(`/users/${user._id}`)

        expect(response).to.have.property('status', 204)
    })
})
