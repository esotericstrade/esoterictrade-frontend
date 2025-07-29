import { apiClient } from "../apiClient";

export const actorService = {
  getAllActors: async (
    param: {
      page: number;
      size: number;
      strategyId?: number;
      instrument?: string;
      sort_by?: string;
      sort_order?: "asc" | "desc";
    } = {
      page: 1,
      size: 12,
    }
  ) => {
    return await apiClient.get<PaginatedResponse<{ data: Actor[] }>>(
      `/api/actors`,
      {
        params: {
          page: param.page,
          size: param.size,
          strategy_id: param.strategyId,
          instrument: param.instrument,
          sort_by: param.sort_by,
          sort_order: param.sort_order,
        },
      }
    );
  },

  // Get actor by ID
  getActorById: async (id: number): Promise<Actor> => {
    return await apiClient.get<Actor>(`/api/actors/${id}`);
  },

  getActorsByStrategy: async (strategyId: number): Promise<Actor[]> => {
    return await apiClient.get<Actor[]>(`/api/actors/strategy/${strategyId}`);
  },

  createActor: async (data: CreateActorRequest): Promise<Actor> => {
    return await apiClient.post<Actor>("/api/actors", data);
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
