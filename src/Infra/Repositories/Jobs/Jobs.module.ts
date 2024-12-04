import { JOB, KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from './RabbitMQConfig';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RabbitMQConfig.queues.createRepository.routingKey,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
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
