import { JOB } from '@metadata';

export const RabbitMQConfig = {
  exchange: 'repositories_exchange',
  queues: {
    createRepository: {
      name: 'create_repository_queue',
      routingKey: JOB.CREATE_REPO_JOB,
    },
    updateRepository: {
      name: 'update_repository_queue',
      routingKey: JOB.UPDATE_REPO_JOB,
    },
  },
};
