import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { ReposModule } from './Modules/Repos.module';
import { User } from './Domain/Models/User.model';
import { Repository } from './Domain/Models/Repositories.model';
import { AuthModule } from './Modules/Auth.module';
import { JobsModule } from './Infra/Repositories/Jobs/Jobs.module';

@Module({
  imports: [
    JobsModule,
    SequelizeModule.forRoot({
      dialect: 'mariadb',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Repository],
    }),
    ReposModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
