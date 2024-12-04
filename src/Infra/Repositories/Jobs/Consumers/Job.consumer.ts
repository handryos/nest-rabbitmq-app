import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { JOB } from '@metadata';
import { RepositoryDTO } from 'src/@shared/@dtos';
import {
  RepositoryModelUniqRef,
  RepositoryUpdateModel,
} from 'src/Domain/Models/Repositories.model';
import { RepositoriesService } from 'src/Domain/Services/Repositories.service';
import { RabbitMQConfig } from '../RabbitMQConfig';

@Injectable()
export class RepositoryConsumer {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @RabbitSubscribe({
    exchange: RabbitMQConfig.exchange,
    routingKey: RabbitMQConfig.queues.createRepository.routingKey,
    queue: RabbitMQConfig.queues.createRepository.name,
  })
  async createRepositoryHandler(data: Partial<RepositoryDTO>): Promise<{}> {
    try {
      const dto = Object.assign(new RepositoryDTO(), data);
      console.log("chegou consumer")
      await this.repositoriesService.create(dto);

      return {
        message:"Success!"
      }
    } catch (error) {
      console.error('Error processing create repository job:', error);
      throw error;
    }
  }

  @RabbitSubscribe({
    exchange: RabbitMQConfig.exchange,
    routingKey: RabbitMQConfig.queues.updateRepository.routingKey,
    queue: RabbitMQConfig.queues.updateRepository.name,
  })
  async updateRepositoryHandler(data: {
    ref: RepositoryModelUniqRef;
    updates: RepositoryUpdateModel;
  }): Promise<void> {
    try {
      const { ref, updates } = data;
      await this.repositoriesService.update(ref, updates);
      console.log('Processed job:', JOB.UPDATE_REPO_JOB, data);
    } catch (error) {
      console.error('Error processing update repository job:', error);
      throw error;
    }
  }
}
