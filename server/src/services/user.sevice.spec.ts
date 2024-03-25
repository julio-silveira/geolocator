import { expect } from 'chai'
import sinon from 'sinon'
import UserService from './user.service'
import { UserModel } from '../models'
import { UserSchema } from '../schemas/user.schemas'
import { User } from '../models/user.model'
import { faker } from '@faker-js/faker'

const buildNewUser = (): {
    userData: UserSchema
    savedUser: User
} => {
    const userData: UserSchema = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
    }

    const savedUser: User = {
        name: userData.name,
        email: userData.email,
        address: userData.address,
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        _id: faker.database.mongodbObjectId(),
        regions: [],
    }

    return { userData, savedUser }
}

describe('UserService', () => {
    it('should create a new user', async () => {
        const userModelMock = sinon.mock(UserModel)
        const { userData, savedUser } = buildNewUser()

        userModelMock.expects('create').once().resolves(savedUser)

        const userService = new UserService(UserModel)
        const createdUser = await userService.createUser(userData)

        expect(createdUser).to.deep.equal(savedUser)
        userModelMock.verify()
        userModelMock.restore()
    })

    it('should get a user by email', async () => {
        const { userData, savedUser } = buildNewUser()
        const userModelMock = sinon.mock(UserModel)
        userModelMock.expects('findOne').once().resolves(savedUser)

        const userService = new UserService(UserModel)
        const fetchedUser = await userService.getUserByEmail(userData.email)

        expect(fetchedUser).to.deep.equal(savedUser)
        userModelMock.verify()
        userModelMock.restore()
    })

    it('should get all users', async () => {
        const users = [buildNewUser().savedUser, buildNewUser().savedUser]

        const userModelMock = sinon.mock(UserModel)
        userModelMock.expects('find').once().withExactArgs().resolves(users)

        const userService = new UserService(UserModel)
        const fetchedUsers = await userService.getUsers()

        expect(fetchedUsers).to.deep.equal(users)
        userModelMock.verify()
        userModelMock.restore()
    })

    it('should return the count of users', async () => {
        const userCount = 5
        const countStub = sinon.stub().returns(userCount)

        const userModelMock = sinon.mock(UserModel)
        userModelMock.expects('count').once().resolves(countStub())

        const userService = new UserService(UserModel)
        const fetchedCount = await userService.getUsersCount()

        expect(fetchedCount).to.equal(userCount)
        userModelMock.verify()
        userModelMock.restore()
    })
    it('should get a user by ID', async () => {
        const { savedUser } = buildNewUser()
        const userModelMock = sinon.mock(UserModel)
        userModelMock.expects('findOne').resolves(savedUser)

        const userService = new UserService(UserModel)
        const fetchedUser = await userService.getUser(savedUser._id.toString())

        expect(fetchedUser).to.deep.equal(savedUser)
        userModelMock.verify()
        userModelMock.restore()
    })

    it('should update user data', async () => {
        const { userData, savedUser } = buildNewUser()

        ;(savedUser as any).save = sinon.stub().resolves(savedUser)

        const userModelMock = sinon.mock(UserModel)
        userModelMock.expects('findOne').resolves(savedUser)

        const userService = new UserService(UserModel)
        const updatedUserData = await userService.updateUser(
            savedUser._id.toString(),
            userData
        )

        expect(updatedUserData.name).to.equal(savedUser.name)
        expect(updatedUserData.email).to.equal(userData.email)
        expect(updatedUserData.address).to.equal(userData.address)

        userModelMock.verify()
        userModelMock.restore()
    })

    it('should delete a user by ID', async () => {
        const { savedUser } = buildNewUser()
        const userModelMock = sinon.mock(UserModel)
        userModelMock.expects('deleteOne').resolves({ deletedCount: 1 })

        const userService = new UserService(UserModel)
        const deletedUser = await userService.deleteUser(
            savedUser._id.toString()
        )

        expect(deletedUser).to.deep.equal({ deletedCount: 1 })
        userModelMock.verify()
        userModelMock.restore()
    })
})
