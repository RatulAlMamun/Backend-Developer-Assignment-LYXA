import { Injectable } from '@nestjs/common';
import { connect, Channel } from 'amqplib';

@Injectable()
export class RabbitPublisherService {
  private channel: Channel;

  async onModuleInit() {
    const conn = await connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await conn.createChannel();
  }

  async publish(event: string, data: any) {
    await this.channel.assertExchange('main', 'topic', { durable: false });
    this.channel.publish('main', event, Buffer.from(JSON.stringify(data)));
  }
}
