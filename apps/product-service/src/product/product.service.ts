// product/product.service.ts
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: ReturnModelType<typeof Product>,
  ) {}
  async create(createDto: CreateProductDto, userId: string) {
    const created = new this.productModel({ ...createDto, userId });
    return created.save();
  }
}
