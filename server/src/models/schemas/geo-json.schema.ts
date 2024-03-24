import { prop } from '@typegoose/typegoose'
import { Schema } from 'mongoose'

export default class GeoJSON {
    @prop({ required: true, type: () => Schema.Types.String })
    type!: string

    @prop({ required: true, type: () => [[[Number]]] })
    coordinates!: number[][][]
}
