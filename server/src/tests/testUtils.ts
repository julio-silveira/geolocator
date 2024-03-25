import { faker } from '@faker-js/faker'
import { RegionModel, UserModel } from '../models'

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

export const createFakeCoordinates = () => {
    const firstPoint = [faker.location.longitude(), faker.location.latitude()]
    const secondPoint = [faker.location.longitude(), faker.location.latitude()]
    const thirdPoint = [faker.location.longitude(), faker.location.latitude()]
    return [firstPoint, secondPoint, thirdPoint, firstPoint]
}

export const createRegionOnDatabase = async (params?: {
    coordinates?: number[][][]
    user?: string
}) => {
    const newRegion = {
        name: faker.location.city(),
        location: {
            type: 'Polygon',
            coordinates: params?.coordinates || [createFakeCoordinates()],
        },
        user: params?.user || (await createUserOnDatabase())._id,
    }

    const region = await RegionModel.create(newRegion)
    return region
}
