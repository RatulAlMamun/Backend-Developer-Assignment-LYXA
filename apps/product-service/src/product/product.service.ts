// product/product.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  async test() {
    return 'hello world';
  }
}
