/**
 * Admin service type declarations
 */

/**
 * Represents the request body for registering a new user (admin only)
 */
interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: "admin" | "user";
}

/**
 * Represents a paginated response
 */
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
