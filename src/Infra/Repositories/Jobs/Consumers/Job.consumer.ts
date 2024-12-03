import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { JOB } from '@metadata';
import { RepositoryDTO } from 'src/@shared/@dtos';
import {
  RepositoryModelUniqRef,
  RepositoryUpdateModel,
} from 'src/Domain/Models/Repositories.model';
import { RepositoriesService } from 'src/Domain/Services/Repositories.service';

@Injectable()
export class RepositoryConsumer {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @RabbitSubscribe({
    exchange: 'repositories_exchange',
    routingKey: JOB.CREATE_REPO_JOB,
    queue: 'create_repository_queue',
  })
  async createRepositoryHandler(data: Partial<RepositoryDTO>): Promise<void> {
    try {
      const dto = Object.assign(new RepositoryDTO(), data);
      await this.repositoriesService.create(dto);
      console.log('Processed job:', JOB.CREATE_REPO_JOB, data);
    } catch (error) {
      console.error('Error processing create repository job:', error);
      throw error;
    }
  }

  @RabbitSubscribe({
    exchange: 'repositories_exchange',
    routingKey: JOB.UPDATE_REPO_JOB,
    queue: 'update_repository_queue',
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