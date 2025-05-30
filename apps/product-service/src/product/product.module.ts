import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (): ClientProxy => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
            queue: 'auth_queue',
            queueOptions: { durable: false },
          },
        });
      },
    },
  ],
})
export class ProductModule {}
