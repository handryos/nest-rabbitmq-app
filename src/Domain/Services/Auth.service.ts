import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { KEY_OF_INJECTION } from 'src/@shared/@metadata';
import { IUserRepository } from '../Interfaces/Repositories/User/IUser.repository';
import { AuthDTO } from 'src/@shared/@dtos';
import { User, UserModelUniqRef } from '../Models/User.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const SALT_FACTOR = 8;
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    return bcrypt.hash(password, salt);
  }

  async create(user: AuthDTO): Promise<void> {
    let hashedPassword = await this.hashPassword(user.password);
    let existingUser = await this.userRepository.getBy({ name: user.name });
    if (existingUser) {
      throw new InternalServerErrorException(
        `User "${user.name}" already exists`,
      );
    }

    const newUser = Object.assign(new User().dataValues, {
      name: user.name,
      password: hashedPassword,
    } as User);

    await this.userRepository.create(newUser);
  }

  async getBy(userUnqRef: UserModelUniqRef) {
    const user = await this.userRepository.getBy(userUnqRef);

    return user ?? null;
  }
}
