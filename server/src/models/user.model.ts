import 'reflect-metadata';

import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { pre, getModelForClass, Prop, Ref, modelOptions } from '@typegoose/typegoose';
import Base from "./base.model";
import ObjectId = mongoose.Types.ObjectId;
import lib from "../utils/lib";
import { Region } from "../models";


@pre<User>('save', async function (next) {
  const region = this as Omit<any, keyof User> & User;

  if (region.isModified('coordinates')) {
    region.address = await lib.getAddressFromCoordinates(region.coordinates);
  } else if (region.isModified('address')) {
    const { lat, lng } = await lib.getCoordinatesFromAddress(region.address);

    region.coordinates = [lng, lat];
  }

  next();
})

export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number];

  @Prop({ required: true, default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[];
}


export const UserModel = getModelForClass(User);
