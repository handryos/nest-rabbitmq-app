import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from './RabbitMQConfig';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: RabbitMQConfig.exchange,
          type: 'direct',
        },
      ],
      uri: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
      connectionInitOptions: { wait: false },
    }),

    ClientsModule.register([
      {
        name: RabbitMQConfig.queues.createRepository.routingKey,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: RabbitMQConfig.queues.createRepository.name,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class JobsModule {}
