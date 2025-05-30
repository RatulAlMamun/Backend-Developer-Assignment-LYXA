import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Product } from './schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async findAll(page = 1, limit = 10) {
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
    if (!data) throw new NotFoundException('Product not found');
    return { message: 'Single product fetch', data };
  }

  async update(id: string, updateDto: UpdateProductDto, user: any) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.userId !== user.sub)
      throw new ForbiddenException('Not the owner');

    const data = await this.productModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    return { message: 'Update successfully', data };
  }

  async remove(id: string, userId: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.userId !== userId)
      throw new ForbiddenException('Not the owner');

    await this.productModel.findByIdAndDelete(id);
    return { message: 'Delete successfully' };
  }
}
