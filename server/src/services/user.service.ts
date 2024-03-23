import { UserModel } from '../models'
import { UserSchema } from '../schemas/user.schemas'

export default class UserService {
    constructor(private readonly userModel: typeof UserModel) {}

    public async createUser(data: UserSchema) {
        const newUser = await this.userModel.create({
            name: data.name,
            email: data.email,
            address: data.address,
            coordinates: [
                data.coordinates.longitude,
                data.coordinates.latitude,
            ],
        })
        return newUser
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

    public async updateUser(id: string, update: any) {
        const user = await this.userModel.findOne({ _id: id })

        if (!user) {
            return null
        }

        user.name = update.name

        await user.save()

        return user
    }
}
