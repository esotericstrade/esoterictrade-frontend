/**
 * User service type declarations
 */

/**
 * Represents a user in the system
 */
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents the request body for updating a user profile
 */
interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

/**
 * Represents the request body for changing a user's password
 */
interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
