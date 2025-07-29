type PaginatedResponse<T> = T & {
  pagination: {
    size: number;
    page: number;
    pages: number;
    total: number;
  };
};
