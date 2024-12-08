import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';

@Injectable()
export class GetRepositorieById {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(repo: number) {
    const repository = await this.repoRepository.getBy({ id: repo });

    if (!repository) {
      throw new Error(`Repository with name "${repo}" not found.`);
    }

    return repository;
  }
}
