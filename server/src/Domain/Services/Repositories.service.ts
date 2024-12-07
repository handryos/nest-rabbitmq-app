import { Inject, Injectable } from '@nestjs/common';
import { KEY_OF_INJECTION } from 'src/@shared/@metadata';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { IRepoRepository } from '../Interfaces/Repositories/Repos/IRepo.repository';
import {
  Repository,
  RepositoryModelUniqRef,
  RepositoryUpdateModel,
} from '../Models/Repositories.model';

@Injectable()
export class RepositoriesService {
  constructor(
    @Inject (KEY_OF_INJECTION.REPOS_REPOSITORY)
    private readonly reposRepository: IRepoRepository,
  ) {}

async create(repositories: RepositoryDTO[]): Promise<void> {
  try {
    for (const repository of repositories) {
      const newRepo = Object.assign(new Repository().dataValues, {
        name: repository.name,
        stars: repository.stars,
        owner: repository.owner,
      } as Repository);
      
      await this.reposRepository.create(newRepo);
    }
  } catch (err: any) {
    throw new Error(`Error creating repositories: ${err.message}`);
  }
}

  async getAll(where?: Partial<Repository>): Promise<Repository[]> {
    try {
      let allRepositories = await this.reposRepository.getAll(where);
      return allRepositories;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getBy(unqRef: RepositoryModelUniqRef): Promise<Repository | null> {
    try {
      let repository = await this.reposRepository.getBy(unqRef);
      return repository;
    } catch (err) {
      throw err;
    }
  }

  async update(
    unqRef: RepositoryModelUniqRef,
    updateData: RepositoryUpdateModel,
  ): Promise<void> {
    try {
      await this.reposRepository.update(unqRef, updateData);
    } catch (error) {
      throw new Error(`Error updating repository: ${error.message}`);
    }
  }

  async delete(unqRef: RepositoryModelUniqRef): Promise<void> {
    try {
      await this.reposRepository.delete(unqRef);
    } catch (error) {
      throw new Error(`Error deleting repository: ${error.message}`);
    }
  }
}
