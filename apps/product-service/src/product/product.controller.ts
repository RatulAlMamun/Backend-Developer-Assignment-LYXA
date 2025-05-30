// product/product.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  test() {
    return this.service.test();
  }
}
