type PaginatedResponse<T> = T & {
  pagination: {
    limit: number;
    page: number;
    pages: number;
    total: number;
  };
};
