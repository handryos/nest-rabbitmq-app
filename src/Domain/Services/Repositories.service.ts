import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
    @Inject(KEY_OF_INJECTION.REPO_QUEUE)
    private readonly reposRepository: IRepoRepository,
    private readonly rabbitClient: ClientProxy,
  ) {}

  async create(repository: RepositoryDTO): Promise<void> {
    const newRepo = Object.assign(new Repository().dataValues, {
      name: repository.name,
      stars: repository.stars,
      owner: repository.owner,
    } as Repository);

    try {
      await this.reposRepository.create(newRepo);
      this.rabbitClient.emit('repository.created', newRepo);
    } catch (err: any) {
      throw new Error(`Error creating the repository: ${err.message}`);
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
      this.rabbitClient.emit('repository.updated', { unqRef, updateData });
    } catch (error) {
      throw new Error(`Error updating repository: ${error.message}`);
    }
  }

  async delete(unqRef: RepositoryModelUniqRef): Promise<void> {
    try {
      await this.reposRepository.delete(unqRef);
      this.rabbitClient.emit('repository.deleted', unqRef);
    } catch (error) {
      throw new Error(`Error deleting repository: ${error.message}`);
    }
  }
}
