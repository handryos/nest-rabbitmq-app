import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';

@Injectable()
export class GetRepositorieByName {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(repo: string) {
    const repos = await this.repoRepository.getBy({ name: repo });

    return repos;
  }
}
