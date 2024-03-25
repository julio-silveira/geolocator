import 'reflect-metadata'

import * as mongoose from 'mongoose'
import { pre, Prop, Ref, modelOptions, prop } from '@typegoose/typegoose'
import ObjectId = mongoose.Types.ObjectId
import Base from './base.model'
import { User } from './user.model'
import { UserModel } from '.'
import GeoJSON from './schemas/geo-json.schema'

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
    @prop({ required: true })
    name!: string

    @prop({ type: () => GeoJSON, index: '2dsphere', required: true })
    location!: {
        type: 'Polygon'
        coordinates: number[][][]
    }

    @prop({ ref: () => User, required: true, type: () => String })
    user: Ref<User>
}
