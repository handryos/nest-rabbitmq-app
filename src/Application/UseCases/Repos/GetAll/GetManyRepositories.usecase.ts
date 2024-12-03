import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/@shared/@pagination';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';

@Injectable()
export class GetManyRepositories {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(pagination: PaginationDto) {
    const repos = await this.repoRepository.getMany(pagination);

    return repos;
  }
}
