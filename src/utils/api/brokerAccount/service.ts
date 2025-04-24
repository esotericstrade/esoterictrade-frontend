import { apiClient } from "../apiClient";

export const brokerAccountService = {
  // Create broker account
  createBrokerAccount: async (
    data: CreateBrokerAccountRequest
  ): Promise<BrokerAccount> => {
    return await apiClient.post<BrokerAccount>("/api/broker-accounts/", data);
  },

  // Get my broker accounts
  getMyBrokerAccounts: async (
    activeOnly: boolean = false
  ): Promise<BrokerAccount[]> => {
    return await apiClient.get<BrokerAccount[]>(
      `/api/broker-accounts/?active_only=${activeOnly}`
    );
  },

  // Get broker account by ID
  getBrokerAccountById: async (id: number): Promise<BrokerAccount> => {
    return await apiClient.get<BrokerAccount>(`/api/broker-accounts/${id}`);
  },

  // Get broker account by type
  getBrokerAccountByType: async (type: string): Promise<BrokerAccount> => {
    return await apiClient.get<BrokerAccount>(
      `/api/broker-accounts/type/${type}`
    );
  },

  // Update broker account
  updateBrokerAccount: async (
    id: number,
    data: UpdateBrokerAccountRequest
  ): Promise<BrokerAccount> => {
    return await apiClient.put<BrokerAccount>(
      `/api/broker-accounts/${id}`,
      data
    );
  },

  // Update OAuth tokens
  updateOAuthTokens: async (
    id: number,
    data: UpdateOAuthTokensRequest
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.put<{ success: boolean; message: string }>(
      `/api/broker-accounts/${id}/tokens`,
      data
    );
  },

  // Delete broker account
  deleteBrokerAccount: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.delete<{ success: boolean; message: string }>(
      `/api/broker-accounts/${id}`
    );
  },

  // Deactivate broker account
  deactivateBrokerAccount: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.post<{ success: boolean; message: string }>(
      `/api/broker-accounts/${id}/deactivate`
    );
  },

  // Activate broker account
  activateBrokerAccount: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.post<{ success: boolean; message: string }>(
      `/api/broker-accounts/${id}/activate`
    );
  },

  // Admin functions

  // Get user broker accounts (admin only)
  getUserBrokerAccounts: async (
    userId: number,
    activeOnly: boolean = false
  ): Promise<BrokerAccount[]> => {
    return await apiClient.get<BrokerAccount[]>(
      `/api/broker-accounts/user/${userId}?active_only=${activeOnly}`
    );
  },

  // Create user broker account (admin only)
  createUserBrokerAccount: async (
    userId: number,
    data: CreateBrokerAccountRequest
  ): Promise<BrokerAccount> => {
    return await apiClient.post<BrokerAccount>(
      `/api/broker-accounts/user/${userId}/create`,
      data
    );
  },
};
