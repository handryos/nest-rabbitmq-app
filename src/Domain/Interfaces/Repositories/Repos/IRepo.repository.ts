import {
  Repository,
  RepositoryModelUniqRef,
  RepositoryUpdateModel,
} from 'src/Domain/Models/Repositories.model';
import { IBaseRepository } from '../IBase.repository';

export type IRepoRepository = IBaseRepository<
  Repository,
  RepositoryUpdateModel,
  RepositoryModelUniqRef
>;
