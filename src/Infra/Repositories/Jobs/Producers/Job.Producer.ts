import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { RepositoryUpdateModel } from 'src/Domain/Models/Repositories.model';
import { JOB } from '@metadata';

@Injectable()
export class RepositoryProducerService {
  private readonly exchange = 'repositories_exchange';

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async addCreateRepositoryJob(data: RepositoryDTO): Promise<void> {
    try {
      await this.amqpConnection.publish(
        this.exchange,
        JOB.CREATE_REPO_JOB,
        data,
      );
      console.log('Job sent:', JOB.CREATE_REPO_JOB, data);
    } catch (error) {
      console.error('Error publishing create repository job:', error);
      throw error;
    }
  }

  async addUpdateRepositoryJob(
    id: number,
    updates: RepositoryUpdateModel,
  ): Promise<void> {
    try {
      const payload = { ref: { id }, updates };
      await this.amqpConnection.publish(
        this.exchange,
        JOB.UPDATE_REPO_JOB,
        payload,
      );
      console.log('Job sent:', JOB.UPDATE_REPO_JOB, payload);
    } catch (error) {
      console.error('Error publishing update repository job:', error);
      throw error;
    }
  }
}
