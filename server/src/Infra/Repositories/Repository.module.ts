import { Global, Module } from '@nestjs/common';
import { RepositoriesSequelizeRepository } from './Sequelize/RepositoriesSequelize.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/Domain/Models/User.model';
import { Repository } from 'src/Domain/Models/Repositories.model';
import { UserSequelizeRepository } from './Sequelize/UserSequelize.repository';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User, Repository])],
  providers: [UserSequelizeRepository, RepositoriesSequelizeRepository],
  exports: [
    SequelizeModule,
    UserSequelizeRepository,
    RepositoriesSequelizeRepository,
  ],
})
export class RepositoryModule {}
