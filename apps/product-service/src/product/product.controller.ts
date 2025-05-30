// product/product.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  test(@CurrentUser() user: any) {
    console.log({ user });
    return this.service.test();
  }
}
