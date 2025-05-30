// rabbitmq/subscriber.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel } from 'amqplib';

@Injectable()
export class RabbitSubscriberService implements OnModuleInit {
  private channel: Channel;

  async onModuleInit() {
    const conn = await connect(
      process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
    );
    this.channel = await conn.createChannel();

    await this.channel.assertExchange('main', 'topic', { durable: true });

    const q = await this.channel.assertQueue('', { exclusive: true });
    await this.channel.bindQueue(q.queue, 'main', 'user.created');

    this.channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log('Received user.created event:', data);

        this.channel.ack(msg);
      }
    });
  }
}
