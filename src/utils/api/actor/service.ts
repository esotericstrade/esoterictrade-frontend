import { apiClient } from "../apiClient";

export const actorService = {
  getAllActors: async (
    page: number = 1,
    limit: number = 20,
    strategyId?: number,
    instrument?: string
  ): Promise<PaginatedResponse<Actor>> => {
    let url = `/api/actors/?page=${page}&limit=${limit}`;
    if (strategyId) url += `&strategy_id=${strategyId}`;
    if (instrument) url += `&instrument=${instrument}`;
    return await apiClient.get<PaginatedResponse<Actor>>(url);
  },

  // Get actor by ID
  getActorById: async (id: number): Promise<Actor> => {
    return await apiClient.get<Actor>(`/api/actors/${id}`);
  },

  getActorsByStrategy: async (strategyId: number): Promise<Actor[]> => {
    return await apiClient.get<Actor[]>(`/api/actors/strategy/${strategyId}`);
  },

  createActor: async (data: CreateActorRequest): Promise<Actor> => {
    return await apiClient.post<Actor>("/api/actors/", data);
  },

  // Update actor (admin only)
  updateActor: async (id: number, data: UpdateActorRequest): Promise<Actor> => {
    return await apiClient.put<Actor>(`/api/actors/${id}`, data);
  },

  deleteActor: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.delete<{ success: boolean; message: string }>(
      `/api/actors/${id}`
    );
  },

  recordActorRun: async (
    data: ActorRunRequest
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.post<{ success: boolean; message: string }>(
      "/api/actors/run",
      data
    );
  },
};
