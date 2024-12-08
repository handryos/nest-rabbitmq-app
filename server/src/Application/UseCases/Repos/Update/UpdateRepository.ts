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
   

    if (!repoDTO.name || typeof repoDTO.name !== 'string' || repoDTO.name.trim() === '') {
      throw new Error('Repository name is required and must be a non-empty string.');
    }

    if (repoDTO.stars === undefined || repoDTO.stars < 0) {
      throw new Error('Repository stars must be a non-negative number.');
    }

    if (!repoDTO.owner || typeof repoDTO.owner !== 'string' || repoDTO.owner.trim() === '') {
      throw new Error('Repository owner is required and must be a non-empty string.');
    }

    const existingRepo = await this.repoRepository.getBy({ id });
    if (!existingRepo) {
      throw new Error(`Cannot update. Repository with ID "${id}" does not exist.`);
    }

    const repoWithSameName = await this.repoRepository.getBy({ name: repoDTO.name });
    if (repoWithSameName && Number(repoWithSameName.id) !== Number(id)) {
      throw new Error(`A repository with the name "${repoDTO.name}" already exists.`);
    }

    const updatedRepo = Object.assign(new RepositoryDTO(), {
      name: repoDTO.name,
      stars: repoDTO.stars,
      owner: repoDTO.owner,
    } as Repository);

    await this.repoRepository.update({ id: id }, updatedRepo);
  }
}
