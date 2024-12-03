import { PaginationProps, GetWithPaginationResult } from '@types';
import { InjectModel } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from 'src/Domain/Interfaces/Repositories/User/IUser.repository';
import {
  User,
  UserModelUniqRef,
  UserUpdateModel,
} from 'src/Domain/Models/User.model';
import { splitKeyAndValue } from 'src/@shared/@utils/tools';

export class UserSequelizeRepository implements IUserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(model: Partial<User>): Promise<void> {
    await this.userModel.create(model);
  }

  async getBy(unqRef: UserModelUniqRef): Promise<User> {
    const [key, value] = splitKeyAndValue(unqRef);

    return this.userModel.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async update(
    unqRef: UserModelUniqRef,
    updModel: UserUpdateModel,
  ): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);
    try {
      await this.userModel.update(updModel, { where: { [key]: value } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: UserModelUniqRef): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const user = await this.userModel.findOne({
        where: { [key]: value },
      });

      await user.destroy();
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  getAll(where?: Partial<User>): Promise<User[]> {
    return this.userModel.findAll({
      where: where,
    });
  }

  async getMany(
    pagination: PaginationProps,
  ): Promise<GetWithPaginationResult<User[]>> {
    const { rows, count } = await this.userModel.findAndCountAll({
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
