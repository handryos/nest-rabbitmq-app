import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';

@Injectable()
export class GetRepositorieByName {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(repo: string) {
    if (!repo || typeof repo !== 'string' || repo.trim() === '') {
      throw new Error('Repository name is required and must be a non-empty string.');
    }

    const repository = await this.repoRepository.getBy({ name: repo });

    if (!repository) {
      throw new Error(`Repository with name "${repo}" not found.`);
    }

    return repository;
  }
}
