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

 async execute(repositories: RepositoryDTO[]): Promise<void> {
  const validatedRepositories = repositories.map((repository) => {
    if (
      !repository.name ||
      typeof repository.name !== 'string' ||
      repository.name.trim() === ''
    ) {
      throw new InternalServerErrorException(
        'Repository name is required and must be a non-empty string.',
      );
    }


    if (
      !repository.owner ||
      typeof repository.owner !== 'string' ||
      repository.owner.trim() === ''
    ) {
      throw new InternalServerErrorException(
        'Repository owner is required and must be a non-empty string.',
      );
    }

    return {
      name: repository.name.trim(),
      stars: repository.stars,
      owner: repository.owner.trim(),
    };
  });

  const repositoryNames = validatedRepositories.map((repo) => repo.name);

  const existingRepos = await this.reposRepository.getAll({
    name: repositoryNames as unknown as string, 
  });

  const duplicates = validatedRepositories.filter((repo) =>
    existingRepos.some((existingRepo) => existingRepo.name === repo.name),
  );

  if (duplicates.length > 0) {
    throw new InternalServerErrorException(
      `Repositories with the following names already exist: ${duplicates
        .map((dup) => dup.name)
        .join(', ')}`,
    );
  }

  await this.repositoryProducer.publishCreateRepositoryMessage(
    validatedRepositories,
  );
}
 
}