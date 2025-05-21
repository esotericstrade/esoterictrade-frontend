import { apiClient } from "../apiClient";

export const subscriptionService = {
  // Create subscription
  createSubscription: async (
    data: CreateSubscriptionRequest
  ): Promise<Subscription> => {
    return await apiClient.post<Subscription>("/api/subscriptions", data);
  },

  // Get subscription by ID
  getSubscriptionById: async (id: number): Promise<Subscription> => {
    return await apiClient.get<Subscription>(`/api/subscriptions/${id}`);
  },

  // Get user subscriptions
  getUserSubscriptions: async (params: {
    userId: string;
    activeOnly?: boolean;
  }): Promise<{
    subscriptions: Subscription[];
    active: number;
    total: number;
  }> => {
    const { userId, activeOnly = false } = params;
    return await apiClient.get<{
      subscriptions: Subscription[];
      active: number;
      total: number;
    }>(`/api/subscriptions/user/${userId}?active_only=${activeOnly}`);
  },

  // Get my subscriptions
  getMySubscriptions: async (
    activeOnly: boolean = false
  ): Promise<Subscription[]> => {
    return await apiClient.get<Subscription[]>(
      `/api/subscriptions/my?active_only=${activeOnly}`
    );
  },

  // Update subscription
  updateSubscription: async (
    id: number,
    data: UpdateSubscriptionRequest
  ): Promise<Subscription> => {
    return await apiClient.put<Subscription>(`/api/subscriptions/${id}`, data);
  },

  // Delete subscription
  deleteSubscription: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.delete<{ success: boolean; message: string }>(
      `/api/subscriptions/${id}`
    );
  },

  // Toggle subscription
  toggleSubscription: async (
    data: ToggleSubscriptionRequest
  ): Promise<{ success: boolean; message: string }> => {
    return await apiClient.post<{ success: boolean; message: string }>(
      "/api/subscriptions/toggle",
      data
    );
  },

  // Get actor subscribers (admin only)
  getActorSubscribers: async (
    actorId: number,
    activeOnly: boolean = false
  ): Promise<Subscription[]> => {
    return await apiClient.get<Subscription[]>(
      `/api/subscriptions/actor/${actorId}?active_only=${activeOnly}`
    );
  },
};
