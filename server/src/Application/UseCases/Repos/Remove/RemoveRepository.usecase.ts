import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';

@Injectable()
export class DeleteRepository {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(repo: string) {
    if (!repo || typeof repo !== 'string' || repo.trim() === '') {
      throw new Error('Repository name is required and must be a non-empty string.');
    }

    const existingRepo = await this.repoRepository.getBy({ name: repo });

    if (!existingRepo) {
      throw new Error(`Cannot delete. Repository with name "${repo}" does not exist.`);
    }

    await this.repoRepository.delete({ name: repo });
  }
}