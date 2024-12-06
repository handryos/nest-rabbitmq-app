import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { ReposModule } from './Modules/Repos.module';
import { User } from './Domain/Models/User.model';
import { Repository } from './Domain/Models/Repositories.model';
import { AuthModule } from './Modules/Auth.module';
import { JobsModule } from './Infra/Repositories/Jobs/Jobs.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JobsModule,
    JwtModule.register({
      global: true,
      secret: 'your-secret-key',
      signOptions: { expiresIn: '2h' },
    }),
    SequelizeModule.forRoot({
      dialect: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB,
      autoLoadModels: true,
      synchronize: true, 
      models: [User, Repository],
      
    }),
    ReposModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
