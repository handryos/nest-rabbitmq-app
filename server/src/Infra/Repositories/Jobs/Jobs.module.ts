import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQConfig } from './RabbitMQConfig';
import * as dotenv from 'dotenv';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RepositoryConsumer } from './Consumers/Job.consumer';
import { ReposModule } from 'src/Modules/Repos.module';
import { RepositoryProducer } from './Producer/Job.producer';


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
     forwardRef(() => ReposModule), 
  ],
  providers: [RepositoryConsumer, RepositoryProducer],
  exports: [RepositoryProducer],
})
export class JobsModule {}

