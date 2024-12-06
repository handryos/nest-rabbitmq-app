import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConfig } from 'src/Infra/Repositories/Jobs/RabbitMQConfig';
import { RepositoryDTO } from 'src/@shared/@dtos';

@Injectable()
export class RepositoryProducer {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishCreateRepositoryMessage(data: RepositoryDTO): Promise<void> {
    try {
      await this.amqpConnection.publish(
        RabbitMQConfig.exchange, 
        RabbitMQConfig.queues.createRepository.routingKey, 
        data 
      );
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }
}
