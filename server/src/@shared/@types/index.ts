export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type AuthResponse = {
  access_token: string;
};

export interface PaginationProps {
  limit?: number;
  order?: 'ASC' | 'DESC';
}
export type GetWithPaginationResult<D> = {
  data: D;
  metadata: PaginationProps & { total: number };
};
