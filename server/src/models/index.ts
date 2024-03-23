import { getModelForClass } from '@typegoose/typegoose'
import { Region } from './region.model'
import { User } from './user.model'

export const UserModel = getModelForClass(User)
export const RegionModel = getModelForClass(Region)
