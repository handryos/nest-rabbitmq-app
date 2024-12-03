import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';

import { LoginUseCase } from 'src/Application/UseCases/User/Login/Login.usecase';
import { RegisterUseCase } from 'src/Application/UseCases/User/Register/Register.usecase';
import { UserSequelizeRepository } from 'src/Infra/Repositories/Sequelize/AccountSequelize.repository';
import AuthControler from 'src/Infra/Http/Controllers/Auth.controller';
import { User } from 'src/Domain/Models/User.model';
import { AuthService } from 'src/Domain/Services/Auth.service';

@Module({
  imports: [User],
  controllers: [AuthControler],
  providers: [
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    //use cases
    LoginUseCase,
    RegisterUseCase,

    //services
    AuthService,
  ],
})
export class AuthModule {}
