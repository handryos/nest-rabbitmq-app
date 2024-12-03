import { GetWithPaginationResult, PaginationProps } from '@types';
import { InjectModel } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { splitKeyAndValue } from 'src/@shared/@utils/tools';
import { User } from 'src/Domain/Models/User.model';
import { IRepoRepository } from 'src/Domain/Interfaces/Repositories/Repos/IRepo.repository';
import {
  Repository,
  RepositoryModelUniqRef,
  RepositoryUpdateModel,
} from 'src/Domain/Models/Repositories.model';

export class RepositoriesSequelizeRepository implements IRepoRepository {
  constructor(
    @InjectModel(User) private readonly repoModel: typeof Repository,
  ) {}

  async create(model: Partial<Repository>): Promise<void> {
    await this.repoModel.create(model);
  }

  async getBy(unqRef: RepositoryModelUniqRef): Promise<Repository> {
    const [key, value] = splitKeyAndValue(unqRef);

    return this.repoModel.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async update(
    unqRef: RepositoryModelUniqRef,
    updModel: RepositoryUpdateModel,
  ): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.repoModel.update(updModel, { where: { [key]: value } });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: RepositoryModelUniqRef): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const user = await this.repoModel.findOne({ [key]: value });

      await user.destroy();
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  getAll(): Promise<Repository[]> {
    return this.repoModel.findAll();
  }

  async getMany(
    pagination: PaginationProps,
  ): Promise<GetWithPaginationResult<Repository[]>> {
    const { rows, count } = await this.repoModel.findAndCountAll({
      limit: pagination.limit,
      order: [['createdAt', pagination.order ?? 'DESC']],
    });

    return {
      data: rows,
      metadata: {
        limit: pagination.limit,
        total: count,
        order: pagination.order,
      },
    };
  }
}
