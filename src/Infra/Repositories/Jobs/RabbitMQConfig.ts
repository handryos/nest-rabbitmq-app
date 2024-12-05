import { JOB } from '@metadata';

export const RabbitMQConfig = {
  exchange: 'repositories_exchange',
  queues: {
    createRepository: {
      name: 'create_repository_queue',
      routingKey: "create_repo_job",
    },
    updateRepository: {
      name: 'update_repository_queue',
      routingKey: JOB.UPDATE_REPO_JOB,
    },
  },
};
