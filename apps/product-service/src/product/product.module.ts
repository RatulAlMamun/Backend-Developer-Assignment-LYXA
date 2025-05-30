import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';
import { getModelToken } from '@nestjs/mongoose';
import { Product, ProductModel } from './schemas/product.schema';
import { Connection } from 'mongoose';

@Module({
  imports: [DatabaseModule],
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
    {
      provide: getModelToken(Product.name),
      useFactory: (connection: Connection) =>
        connection.model(Product.name, ProductModel.schema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class ProductModule {}
