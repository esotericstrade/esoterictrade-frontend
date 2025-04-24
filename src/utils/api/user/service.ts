import { apiClient } from "../apiClient";

export const userService = {
  // Get current user profile
  getCurrentProfile: async (): Promise<User> => {
    return await apiClient.get<User>("/api/users/profile");
  },

  // Update current user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return await apiClient.put<User>("/api/users/profile", data);
  },

  // Change password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.post<{ success: boolean; message: string }>(
      "/api/users/change-password",
      data
    );
  },
};
