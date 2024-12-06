import { Inject, Injectable } from '@nestjs/common';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { Repository } from 'src/Domain/Models/Repositories.model';
import { RepositoryProducer } from 'src/Infra/Repositories/Jobs/Producer/Job.producer';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { KEY_OF_INJECTION } from '@metadata';

@Injectable()
export class AddRepository {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly reposRepository: IRepoRepository,
    @Inject(RepositoryProducer)
    private readonly repositoryProducer: RepositoryProducer,
  ) {}

  async execute(repository: RepositoryDTO) {
    if (!repository.name || typeof repository.name !== 'string' || repository.name.trim() === '') {
      throw new InternalServerErrorException('Repository name is required and must be a non-empty string.');
    }

    if (!repository.stars || repository.stars < 0) {
      throw new InternalServerErrorException('Repository stars must be a non-negative number.');
    }

    if (!repository.owner || typeof repository.owner !== 'string' || repository.owner.trim() === '') {
      throw new InternalServerErrorException('Repository owner is required and must be a non-empty string.');
    }

    const existingRepo = await this.reposRepository.getBy({ name: repository.name });
    if (existingRepo) {
      throw new InternalServerErrorException(`A repository with the name "${repository.name}" already exists.`);
    }

    const newRepo = new Repository();
    Object.assign(newRepo, {
      name: repository.name,
      stars: repository.stars,
      owner: repository.owner,
    });

    await this.repositoryProducer.publishCreateRepositoryMessage(newRepo);

    return { message: 'Repository creation started successfully!', status: 201 };
  }
 
}