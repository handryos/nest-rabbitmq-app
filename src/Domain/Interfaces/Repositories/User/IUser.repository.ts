import { IBaseRepository } from '../IBase.repository';
import {
  User,
  UserModelUniqRef,
  UserUpdateModel,
} from 'src/Domain/Models/User.model';

export type IUserRepository = IBaseRepository<
  User,
  UserUpdateModel,
  UserModelUniqRef
>;
