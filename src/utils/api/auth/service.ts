import { apiClient } from "../apiClient";

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );

    // Store tokens in local storage
    if (response.access_token && response.refresh_token) {
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
    }

    return response;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const request: RefreshTokenRequest = { refresh_token: refreshToken };
    const response = await apiClient.post<RefreshTokenResponse>(
      "/api/users/refresh-token",
      request
    );

    // Update tokens in local storage
    if (response.access_token && response.refresh_token) {
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
    }

    return response;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  },
};