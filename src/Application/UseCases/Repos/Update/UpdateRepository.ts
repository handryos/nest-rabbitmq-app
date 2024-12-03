import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';
import { Repository } from 'src/Domain/Models/Repositories.model';

@Injectable()
export class UpdateRepository {
  constructor(
    @Inject(KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly repoRepository: IRepoRepository,
  ) {}

  async execute(repoDTO: RepositoryDTO, id: number) {
    let updatedRepo = Object.assign(new RepositoryDTO(), {
      name: repoDTO.name,
      stars: repoDTO.stars,
      owner: repoDTO.owner,
    } as Repository);

    await this.repoRepository.update({ id: id }, updatedRepo);
  }
}
