import { Injectable, Inject } from '@nestjs/common';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { Repository } from 'src/Domain/Models/Repositories.model';
import { RabbitMQConfig } from 'src/Infra/Repositories/Jobs/RabbitMQConfig';
import { RepositoriesService } from 'src/Domain/Services/Repositories.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { InternalServerErrorException } from '@nestjs/common';


@Injectable()
export class RepositoryConsumer {
  constructor(
     private readonly service: RepositoriesService) {}

  @RabbitSubscribe({
    exchange: RabbitMQConfig.exchange,
    routingKey: RabbitMQConfig.queues.createRepository.routingKey,
    queue: RabbitMQConfig.queues.createRepository.name,
  })
  async createRepositoryHandler(data: Partial<RepositoryDTO>): Promise<{}> {
    try {
      const dto = Object.assign(new RepositoryDTO(), data as Repository);
      await this.service.create(dto);
      return { message: 'Success!' };
    } catch (error) {
      console.error('Error processing create repository job:', error);
      return new InternalServerErrorException(error.message)
    }
  }
}
