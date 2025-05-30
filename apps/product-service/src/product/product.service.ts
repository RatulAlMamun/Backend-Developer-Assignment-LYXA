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
    const product = await created.save();
    return { message: 'Product create successfully!', data: product };
  }

  async findAll(user: any, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.productModel.find().skip(skip).limit(limit),
      this.productModel.countDocuments(),
    ]);

    return {
      message: 'All products',
      data,
      total,
    };
  }

  async findOne(id: string) {
    const data = await this.productModel.findById(id);
    return { message: 'Single product fetch', data };
  }
}
