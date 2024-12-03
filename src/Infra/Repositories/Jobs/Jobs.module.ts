import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RepositoriesService } from 'src/Domain/Services/Repositories.service';
import { RepositoryConsumer } from './Consumers/Job.consumer';
import { RepositoryProducerService } from './Producers/Job.Producer';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'repositories_exchange',
          type: 'topic',
        },
      ],
      uri: 'amqp://user:password@localhost:5672',
    }),
  ],
  providers: [
    RepositoriesService,
    RepositoryProducerService,
    RepositoryConsumer,
  ],
  exports: [RepositoryProducerService],
})
export class RepositoriesQueueModule {}
