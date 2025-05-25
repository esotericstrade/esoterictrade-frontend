// src/utils/api/admin/service.ts

import { apiClient } from "../apiClient";

export const adminService = {
  // Get all users (admin only)
  getAllUsers: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<{ users: User[] }>> => {
    try {
      const response = await apiClient.get<
        PaginatedResponse<{ users: User[] }>
      >(`/api/users?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
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


  createBroker: async (brokerData: CreateBrokerAccountRequest): Promise<BrokerAccount> => {
    try {
      const response = await apiClient.post<BrokerAccount>("/api/broker-accounts", brokerData);
      return response;
    } catch (error) {
      console.error("Error in createBroker:", error);
      throw error;
    }
  },

  // Update broker account by ID (admin only)
  updateBrokerById: async (id: number, data: UpdateBrokerAccountRequest): Promise<BrokerAccount> => {
    try {
      const response = await apiClient.put<BrokerAccount>(`/api/broker-accounts/${id}`, data);
      return response;
    } catch (error) {
      console.error("Error in updateBrokerById:", error);
      throw error;
    }
  },

  // Delete broker account by ID (admin only)
  deleteBrokerById: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        `/api/broker-accounts/${id}`
      );
      return response;
    } catch (error) {
      console.error("Error in deleteBrokerById:", error);
      throw error;
    }
  },

  // Deactivate broker account (admin only)
  deactivateBroker: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/api/broker-accounts/${id}/deactivate`
      );
      return response;
    } catch (error) {
      console.error("Error in deactivateBroker:", error);
      throw error;
    }
  },

  // Activate broker account (admin only)
  activateBroker: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/api/broker-accounts/${id}/activate`
      );
      return response;
    } catch (error) {
      console.error("Error in activateBroker:", error);
      throw error;
    }
  },

  // Get broker account by ID (admin only)
  getBrokerById: async (id: number): Promise<BrokerAccount> => {
    try {
      const response = await apiClient.get<BrokerAccount>(`/api/broker-accounts/${id}`);
      return response;
    } catch (error) {
      console.error("Error in getBrokerById:", error);
      throw error;
    }
  },

  // Update broker OAuth tokens (admin only)
  updateBrokerTokens: async (id: number, tokens: UpdateOAuthTokensRequest): Promise<BrokerAccount> => {
    try {
      const response = await apiClient.put<BrokerAccount>(`/api/broker-accounts/${id}/tokens`, tokens);
      return response;
    } catch (error) {
      console.error("Error in updateBrokerTokens:", error);
      throw error;
    }
  },

 getAllBrokers: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<{ brokers: BrokerAccount[] }>> => {
    try {
      console.log(`🔥 Fetching brokers for page ${page} with limit ${limit}`);
      
      // Make API call expecting the actual response structure
      const response = await apiClient.get<{
        data: BrokerAccount[];
        pagination: any;
        applied_filters?: any;
        applied_sorting?: any;
      }>(`/api/broker-accounts?page=${page}&size=${limit}`);
      
      console.log(`🔥 API Response for page ${page}:`, response);
      
      // Transform to match expected structure
      const transformedResponse = {
        pagination: response.pagination,
        brokers: response.data || [],
      };
      
      console.log(`🔥 Transformed Response for page ${page}:`, transformedResponse);
      return transformedResponse;
    } catch (error) {
      console.error("Error in getAllBrokers:", error);
      throw error;
    }
  },
};
