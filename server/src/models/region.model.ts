import 'reflect-metadata'

import * as mongoose from 'mongoose'
import { pre, Prop, Ref, modelOptions } from '@typegoose/typegoose'
import ObjectId = mongoose.Types.ObjectId
import Base from './base.model'
import { User } from './user.model'
import { UserModel } from '.'

@pre<Region>('save', async function (next) {
    const region = this as Omit<any, keyof Region> & Region

    if (!region._id) {
        region._id = new ObjectId().toString()
    }

    if (region.isNew) {
        const user = await UserModel.findOne({ _id: region.user })
        user.regions.push(region._id)
        await user.save({ session: region.$session() })
    }

    next(region.validateSync())
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region extends Base {
    @Prop({ required: true })
    name!: string

    @Prop({ required: true })
    type: string

    @Prop({ required: true, type: () => [[Number]], index: '2dsphere'})
    coordinates: number[][]

    @Prop({ ref: () => User, required: true, type: () => String })
    user: Ref<User>
}
