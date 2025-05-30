import { apiClient } from "../apiClient";

export const webhookService = {
  /**
   * Trigger EMA SMA SLOPE webhook
   */
  triggerEmaSmaSlope: async (
    data: BaseWebhookPayload
  ): Promise<WebhookResponse> => {
    return await apiClient.post<WebhookResponse>(
      "/api/webhook/ema-sma-slope",
      data
    );
  },

  /**
   * Trigger Trading View EMA SMA SLOPE webhook
   */
  triggerTradingViewEmaSmaSlope: async (
    data: TradingViewWebhookPayload
  ): Promise<WebhookResponse> => {
    return await apiClient.post<WebhookResponse>("/webhook/ema_sma_slope", data);
  },

  /**
   * Verify Kite Logins webhook
   */
  verifyKiteLogins: async (
    data: VerifyWebhookRequest
  ): Promise<WebhookResponse> => {
    return await apiClient.post<WebhookResponse>(
      "/api/webhook/verify-kite",
      data
    );
  },

  /**
   * Update GTT webhook
   */
  updateGTT: async (data: GTTWebhookPayload): Promise<WebhookResponse> => {
    return await apiClient.post<WebhookResponse>("/webhook/update_gtt", data);
  },

  /**
   * Create GTT webhook
   */
  createGTT: async (data: GTTWebhookPayload): Promise<WebhookResponse> => {
    return await apiClient.post<WebhookResponse>("/webhook/create_gtt", data);
  },

  /**
   * Get all registered webhook callbacks
   */
  getWebhookCallbacks: async (): Promise<WebhookCallbacksResponse> => {
    return await apiClient.get<WebhookCallbacksResponse>("/api/webhook/callbacks");
  },

  /**
   * Register a new webhook callback
   */
  registerWebhookCallback: async (
    data: { endpoint: string; description?: string }
  ): Promise<WebhookResponse> => {
    return await apiClient.post<WebhookResponse>("/api/webhook/register", data);
  },

  /**
   * Deactivate a webhook callback
   */
  deactivateWebhookCallback: async (
    id: number
  ): Promise<WebhookResponse> => {
    return await apiClient.post<WebhookResponse>(
      `/api/webhook/deactivate/${id}`,
      {}
    );
  },
};
