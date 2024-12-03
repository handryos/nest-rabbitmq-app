import { Inject, Injectable } from '@nestjs/common';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';
import { Repository } from 'src/Domain/Models/Repositories.model';
import { KEY_OF_INJECTION } from '@metadata';
import { RepositoryDTO } from 'src/@shared/@dtos';

@Injectable()
export class AddRepository {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(repo: RepositoryDTO) {
    const newRepo = Object.assign(new Repository().dataValues, {
      name: repo.name,
      stars: repo.stars,
      owner: repo.owner,
    } as Repository);

    await this.repoRepository.create(newRepo);
  }
}
