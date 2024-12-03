import { JOB, KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KEY_OF_INJECTION.REPO_QUEUE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'repositories_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [KEY_OF_INJECTION.REPO_QUEUE],
})
export class JobsModule {}
