import { Prop, getModelForClass } from '@typegoose/typegoose';

export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  userId: string;
}

export const ProductModel = getModelForClass(Product);
