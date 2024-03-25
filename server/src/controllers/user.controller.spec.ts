import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response } from 'express'
import UserController from './user.controller'
import { faker } from '@faker-js/faker'

describe('UserController', () => {
    let userServiceMock
    let userController: UserController

    beforeEach(() => {
        userServiceMock = {
            createUser: sinon.stub(),
            getUsers: sinon.stub(),
            getUsersCount: sinon.stub(),
            getUser: sinon.stub(),
            getUserByEmail: sinon.stub(),
            updateUser: sinon.stub(),
            deleteUser: sinon.stub(),
        }

        userController = new UserController(userServiceMock)
    })

    it('should create a user', async () => {
        const req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                address: 'Test Address',
            },
        } as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        userServiceMock.getUserByEmail.resolves(null)
        userServiceMock.createUser.resolves({ name: 'Test User' })

        await userController.create(req, res)

        expect((res.status as any).calledWith(201)).to.be.true
        expect((res.json as any).calledWith({ name: 'Test User' })).to.be.true
    })

    it('should return all users', async () => {
        const req = { query: {} } as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockUsers = [{ name: 'User 1' }, { name: 'User 2' }]
        const mockCount = 2

        userServiceMock.getUsers.resolves(mockUsers)
        userServiceMock.getUsersCount.resolves(mockCount)

        await userController.getAll(req, res)

        expect((res.status as any).calledWith(200)).to.be.true
        expect(
            (res.json as any).calledWith({
                rows: mockUsers,
                total: mockCount,
                page: undefined,
                limit: undefined,
            })
        ).to.be.true
    })

    it('should return a user by id', async () => {
        const req = {
            params: { id: faker.database.mongodbObjectId },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockUser = { name: 'User 1' }

        userServiceMock.getUser.resolves(mockUser)

        await userController.getOne(req, res)

        expect((res.status as any).calledWith(200)).to.be.true
        expect((res.json as any).calledWith(mockUser)).to.be.true
    })

    it('should update a user', async () => {
        const req = {
            params: { id: faker.database.mongodbObjectId() },
            body: { name: 'Updated User' },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        } as unknown as Response

        const mockUser = { name: 'Test User' }
        userServiceMock.getUser.resolves(mockUser)
        userServiceMock.getUserByEmail.resolves(null)
        userServiceMock.updateUser.resolves(mockUser)

        await userController.update(req, res)

        expect((res.status as any).calledWith(201)).to.be.true
        expect((res.json as any).calledWith(mockUser)).to.be.true
    })

    it('should delete a user', async () => {
        const req = {
            params: { id: faker.database.mongodbObjectId() },
        } as unknown as Request
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            send: sinon.stub(),
        } as unknown as Response

        const mockUser = { name: 'Test User' }
        userServiceMock.getUser.resolves(mockUser)
        userServiceMock.deleteUser.resolves()

        await userController.delete(req, res)

        expect((res.status as any).calledWith(204)).to.be.true
    })
})
