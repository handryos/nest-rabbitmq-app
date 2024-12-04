import { Module } from '@nestjs/common';
import { RepositoriesController } from 'src/Infra/Http/Controllers/Repositories.controller';
import { RepositoriesSequelizeRepository } from 'src/Infra/Repositories/Sequelize/RepositoriesSequelize.repository';
import { KEY_OF_INJECTION } from '@metadata';

// Use cases
import { AddRepository } from 'src/Application/UseCases/Repos/Add/AddRepository.usecase';
import { GetManyRepositories } from 'src/Application/UseCases/Repos/GetAll/GetManyRepositories.usecase';
import { GetRepositorieByName } from 'src/Application/UseCases/Repos/GetBy/GetBy.usecase';
import { UpdateRepository } from 'src/Application/UseCases/Repos/Update/UpdateRepository';
import { DeleteRepository } from 'src/Application/UseCases/Repos/Remove/RemoveRepository.usecase';
import { SequelizeModule } from '@nestjs/sequelize';
import { Repository } from 'src/Domain/Models/Repositories.model';

@Module({
  imports: [SequelizeModule.forFeature([Repository])],
  controllers: [RepositoriesController],
  providers: [
    {
      provide: KEY_OF_INJECTION.REPOS_REPOSITORY,
      useClass: RepositoriesSequelizeRepository,
    },
    AddRepository,
    GetManyRepositories,
    GetRepositorieByName,
    UpdateRepository,
    DeleteRepository,
  ],
})
export class ReposModule {}
