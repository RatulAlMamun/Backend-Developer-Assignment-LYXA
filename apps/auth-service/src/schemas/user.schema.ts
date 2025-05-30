import { prop, getModelForClass } from '@typegoose/typegoose';

export class User {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: 'user' })
  role: string;
}

export const UserModel = getModelForClass(User);
