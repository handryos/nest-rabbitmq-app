import { Module, forwardRef } from '@nestjs/common';
import { RepositoriesController } from 'src/Infra/Http/Controllers/Repositories.controller';
import { RepositoriesSequelizeRepository } from 'src/Infra/Repositories/Sequelize/RepositoriesSequelize.repository';
import { KEY_OF_INJECTION } from '@metadata';

// Use cases
import { AddRepository } from 'src/Application/UseCases/Repos/Add/AddRepository.usecase';
import { GetManyRepositories } from 'src/Application/UseCases/Repos/GetAll/GetManyRepositories.usecase';
import { GetRepositorieById } from 'src/Application/UseCases/Repos/GetBy/GetBy.usecase';
import { UpdateRepository } from 'src/Application/UseCases/Repos/Update/UpdateRepository';
import { DeleteRepository } from 'src/Application/UseCases/Repos/Remove/RemoveRepository.usecase';
import { SequelizeModule } from '@nestjs/sequelize';
import { Repository } from 'src/Domain/Models/Repositories.model';
import { JobsModule } from 'src/Infra/Repositories/Jobs/Jobs.module';
import { RepositoryConsumer } from 'src/Infra/Repositories/Jobs/Consumers/Job.consumer';
import { RepositoriesService } from 'src/Domain/Services/Repositories.service';
import { RepositoryProducer } from 'src/Infra/Repositories/Jobs/Producer/Job.producer';

@Module({
  imports: [SequelizeModule.forFeature([Repository]), forwardRef(() => JobsModule),],
  controllers: [RepositoriesController],
  providers: [
    {
      provide: KEY_OF_INJECTION.REPOS_REPOSITORY,
      useClass: RepositoriesSequelizeRepository,
    },
    RepositoryConsumer,
    RepositoriesService,  
    AddRepository,
    GetManyRepositories,
    GetRepositorieById,
    UpdateRepository,
    DeleteRepository,
  ],
  exports: [RepositoriesService],  
})
export class ReposModule {}
