import { apiClient } from "../apiClient";

export const userAdminBrokerService = {
  getUserPositionsById: async (userId: number) => {
    return (
      await apiClient.get<{ positions: Position[] }>(
        `/api/admin-broker/kite/users/${userId}/positions`
      )
    ).positions;
  },
  getUserHoldingsById: async (userId: number) => {
    return await apiClient.get<Holding[]>(
      `/api/admin-broker/kite/users/${userId}/holdings`
    );
  },
  getUserMarginsById: async (userId: number) => {
    return await apiClient.get<Margin[]>(
      `/api/admin-broker/kite/users/${userId}/margins`
    );
  },
  getCurrentUserPositions: async () => {
    return (
      await apiClient.get<{ positions: Position[] }>(
        `/api/user-broker/kite/positions`
      )
    ).positions;
  },
  getCurrentUserHoldings: async () => {
    return await apiClient.get<Holding[]>(`/api/user-broker/kite/holdings`);
  },
  getCurrentUserMargins: async () => {
    return await apiClient.get<Margin[]>(`/api/user-broker/kite/margins`);
  },
  getBulkUserPositions: async (page: number = 1, size: number = 20) => {
    return await apiClient.get<PaginatedResponse<Position>>(
      `/api/admin-broker/kite/positions?page=${page}&size=${size}`
    );
  },
  getBulkUserHoldings: async (page: number = 1, size: number = 20) => {
    return await apiClient.get<PaginatedResponse<Holding>>(
      `/api/admin-broker/kite/holdings?page=${page}&size=${size}`
    );
  },
  getBulkUserMargins: async (page: number = 1, size: number = 20) => {
    return await apiClient.get<PaginatedResponse<Margin>>(
      `/api/admin-broker/kite/margins?page=${page}&size=${size}`
    );
  },
};
