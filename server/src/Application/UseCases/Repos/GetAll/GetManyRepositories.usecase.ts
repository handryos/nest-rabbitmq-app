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
    let filters = pagination
    if(filters == undefined){
      filters = {
  "page": 1,
  "limit": 10,
  "order": "ASC"
}
}
    const repos = await this.repoRepository.getMany(filters);



    if (!Array.of(repos).length) {
      throw new Error('No repositories found.');
    }

    return repos;
  }
}
