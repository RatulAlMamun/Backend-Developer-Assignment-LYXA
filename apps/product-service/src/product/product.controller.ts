import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.sub);
  }
}
