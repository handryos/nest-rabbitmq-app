import { KEY_OF_INJECTION } from "@metadata";
import { PaginationDto } from "src/@shared/@pagination";
import { IRepoRepository } from "src/Domain/Interfaces/Repositories/Repos/IRepo.repository";
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetManyRepositories {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(pagination: PaginationDto) {
    const { page, limit } = pagination;

    if (!page || page <= 0) {
      throw new Error('Page must be a positive number.');
    }

    if (!limit || limit <= 0) {
      throw new Error('Limit must be a positive number.');
    }

    const repos = await this.repoRepository.getMany(pagination);

    if (!Array.of(repos).length) {
      throw new Error('No repositories found.');
    }

    return repos;
  }
}
