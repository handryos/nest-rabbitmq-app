import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';

@Injectable()
export class DeleteRepository {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(repo: string) {
    await this.repoRepository.delete({ name: repo });
  }
}
