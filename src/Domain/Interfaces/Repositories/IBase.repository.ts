import { GetWithPaginationResult, PaginationProps } from '@types';

export interface IBaseRepository<Model, UpdateModel, ModelUniqueRefs> {
  create(model: Omit<Model, "id">): Promise<void>;
  getBy(unqRef: ModelUniqueRefs): Promise<Model | null>;
  update(unqRef: ModelUniqueRefs, updModel: UpdateModel): Promise<void>;
  delete(unqRef: ModelUniqueRefs): Promise<void>;
  getAll(where?: Partial<Model>): Promise<Model[]>;
  getMany(
    pagination: PaginationProps,
    or?: Partial<Model>,
  ): Promise<GetWithPaginationResult<Model[]>>;
}
