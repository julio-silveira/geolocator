import { faker } from '@faker-js/faker'
import { UserModel } from '../models'

export const createUserOnDatabase = async () => {
    const newUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        coordinates: [faker.location.latitude(), faker.location.longitude()],
    }

    const user = await UserModel.create(newUser)
    return user
}
