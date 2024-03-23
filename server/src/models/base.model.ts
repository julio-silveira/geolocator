import 'reflect-metadata'

import * as mongoose from 'mongoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import {
    pre,
    getModelForClass,
    Prop,
    Ref,
    modelOptions,
} from '@typegoose/typegoose'
import ObjectId = mongoose.Types.ObjectId
import lib from '../utils/lib'

class Base extends TimeStamps {
    @Prop({ required: true, default: () => new ObjectId().toString() })
    _id: string
}

export default Base
