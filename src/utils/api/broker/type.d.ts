type Position = {
  // Add position fields based on your API response
  id: string;
  // Add other position fields
};

type Holding = {
  // Add holding fields based on your API response
  id: string;
  // Add other holding fields
};

type Margin = {
  // Add margin fields based on your API response
  id: string;
  // Add other margin fields
};

type PaginatedResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};
