import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from './Infra/Repositories/Jobs/RabbitMQConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const queues = [RabbitMQConfig.queues.createRepository.name, RabbitMQConfig.queues.updateRepository.name];

  for (const queue of queues) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq-my:5672'],
        queue: queue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 8000);
  console.log('Server iniciado✅');
}
bootstrap();
