import { UserModel } from '../models'
import { UserSchema } from '../schemas/user.schemas'

export default class UserService {
    constructor(private readonly userModel: typeof UserModel) {}

    public async createUser(data: UserSchema) {
        const newUser = await this.userModel.create({
            name: data.name,
            email: data.email,
            address: data?.address,
            coordinates: data.coordinates
                ? [data?.coordinates?.longitude, data?.coordinates?.latitude]
                : undefined,
        })
        return newUser
    }

    public async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email }).lean()
        return user
    }

    public async getUsers() {
        const users = await this.userModel.find().lean()

        return users
    }

    public async getUsersCount() {
        const count = await this.userModel.count()

        return count
    }

    public async getUser(id: string) {
        const user = await this.userModel.findOne({ _id: id }).lean()

        return user
    }

    public async updateUser(id: string, data: UserSchema) {
        const user = await this.userModel.findOne({ _id: id })
        if (data?.address) {
            user.address = data.address
        }
        if (data.coordinates) {
            user.coordinates = [
                data.coordinates.longitude,
                data.coordinates.latitude,
            ]
        }

        if (data?.email) {
            user.email = data.email
        }

        if (data?.name) {
            user.name = data.name
        }

        await user.save()

        return user
    }
}
