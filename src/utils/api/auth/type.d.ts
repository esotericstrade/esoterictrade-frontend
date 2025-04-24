/**
 * Authentication service type declarations
 */

/**
 * Represents the request body for logging in
 */
interface LoginRequest {
  username_or_email: string;
  password: string;
}

/**
 * Represents the response from a successful login
 */
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

/**
 * Represents the request body for refreshing an access token
 */
interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * Represents the response from a token refresh
 */
interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
