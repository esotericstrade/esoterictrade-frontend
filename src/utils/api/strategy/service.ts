import { apiClient } from "../apiClient";

export const strategyService = {
  getAllStrategies: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Strategy>> => {
    return await apiClient.get<PaginatedResponse<Strategy>>(
      `/api/strategies/?page=${page}&limit=${limit}`
    );
  },

  // Get strategy by ID
  getStrategyById: async (id: number): Promise<Strategy> => {
    return await apiClient.get<Strategy>(`/api/strategies/${id}`);
  },

  getStrategyByName: async (name: string): Promise<Strategy> => {
    return await apiClient.get<Strategy>(`/api/strategies/name/${name}`);
  },

  createStrategy: async (data: CreateStrategyRequest): Promise<Strategy> => {
    return await apiClient.post<Strategy>("/api/strategies/", data);
  },

  // Update strategy (admin only)
  updateStrategy: async (
    id: number,
    data: UpdateStrategyRequest
  ): Promise<Strategy> => {
    return await apiClient.put<Strategy>(`/api/strategies/${id}`, data);
  },

  deleteStrategy: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.delete<{ success: boolean; message: string }>(
      `/api/strategies/${id}`
    );
  },
};
