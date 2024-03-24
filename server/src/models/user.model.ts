import 'reflect-metadata'

import * as mongoose from 'mongoose'
import { pre, Prop, Ref, modelOptions } from '@typegoose/typegoose'
import ObjectId = mongoose.Types.ObjectId
import lib from '../utils/lib'
import { Region } from './region.model'
import Base from './base.model'

@pre<User>('save', async function (next) {
    const user = this as Omit<any, keyof User> & User
    if (user.isModified('coordinates')) {
        user.address = await lib.getAddressFromCoordinates(user.coordinates)
    } else if (user.isModified('address')) {
        const { lat, lng } = await lib.getCoordinatesFromAddress(user.address)

        user.coordinates = [lng, lat]
    }

    next()
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class User extends Base {
    @Prop({ required: true })
    name!: string

    @Prop({ required: true })
    email!: string

    @Prop({ required: true })
    address: string

    @Prop({ required: true, type: () => [Number] })
    coordinates: [number, number]

    @Prop({
        required: true,
        default: [],
        ref: () => Region,
        type: () => String,
    })
    regions: Ref<Region>[]
}
