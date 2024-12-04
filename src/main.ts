import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { KEY_OF_INJECTION } from '@metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const queues = [KEY_OF_INJECTION.REPO_QUEUE];

  for (const queue of queues) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
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
}
bootstrap();
