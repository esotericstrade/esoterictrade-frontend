// src/utils/api/admin/service.ts
import { apiClient } from "../apiClient";

export const adminService = {
  // Get all users (admin only)
  getAllUsers: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User> | any> => {
    try {
      const response = await apiClient.get<PaginatedResponse<User> | any>(
        `/api/users/?page=${page}&limit=${limit}`
      );
      
      console.log('Raw API response:', response);
      return response;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },


  // Get user by username (admin only)
  getUserByUsername: async (username: string): Promise<User> => {
    return await apiClient.get<User>(`/api/users/${username}`);
  },

  // Update user by username (admin only)
  updateUserByUsername: async (
    username: string,
    data: Partial<User>
  ): Promise<User> => {
    return await apiClient.put<User>(`/api/users/${username}`, data);
  },

  // Update user by ID (admin only)
  updateUserById: async (id: number, data: Partial<User>): Promise<User> => {
    return await apiClient.put<User>(`/api/users/id/${id}`, data);
  },

  // Delete user by username (admin only)
  deleteUserByUsername: async (
    username: string
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.delete<{ success: boolean; message: string }>(
      `/api/users/${username}`
    );
  },

  // Delete user by ID (admin only)
  deleteUserById: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.delete<{ success: boolean; message: string }>(
      `/api/users/id/${id}`
    );
  },

  // Deactivate user (admin only)
  deactivateUser: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.post<{ success: boolean; message: string }>(
      `/api/users/${id}/deactivate`
    );
  },

  // Check admin status (admin only)
  checkAdminStatus: async (id: number): Promise<{ is_admin: boolean }> => {
    return await apiClient.get<{ is_admin: boolean }>(
      `/api/users/admin-check/${id}`
    );
  },

  // Register/Create user (admin only)
  registerUser: async (userData: RegisterUserRequest): Promise<User> => {
    return await apiClient.post<User>("/api/users/register", userData);
  },
};