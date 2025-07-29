import { apiClient } from "../apiClient";

export const reportService = {
  /**
   * Get user activity report
   */
  getUserActivityReport: async (
    params: UserActivityReportParams = {}
  ): Promise<PaginatedReportResponse<UserActivityReportItem>> => {
    return await apiClient.get<PaginatedReportResponse<UserActivityReportItem>>(
      "/api/reports/users",
      {
        params: {
          user_id: params.user_id,
          start_date: params.start_date,
          end_date: params.end_date,
          page: params.page || 1,
          size: params.size || 200,
        },
      }
    );
  },

  /**
   * Get subscription report
   */
  getSubscriptionReport: async (
    params: SubscriptionReportParams = {}
  ): Promise<PaginatedReportResponse<SubscriptionReportItem>> => {
    return await apiClient.get<PaginatedReportResponse<SubscriptionReportItem>>(
      "/api/reports/subscriptions",
      {
        params: {
          user_id: params.user_id,
          actor_id: params.actor_id,
          start_date: params.start_date,
          end_date: params.end_date,
          page: params.page || 1,
          size: params.size || 20,
        },
      }
    );
  },

  /**
   * Get trade report
   */
  getTradeReport: async (
    params: TradeReportParams = {}
  ): Promise<TTradeReportsResponse> => {
    return await apiClient.get<TTradeReportsResponse>("/api/reports/trades", {
      params: {
        symbol: params.symbol,
        start_date: params.start_date,
        end_date: params.end_date,
        page: params.page || 1,
        size: params.size || 20,
      },
    });
  },

  /**
   * Get entity report
   */
  getEntityReport: async (
    params: EntityReportParams
  ): Promise<PaginatedReportResponse<EntityReportItem>> => {
    const { entity_type, entity_id, ...queryParams } = params;

    return await apiClient.get<PaginatedReportResponse<EntityReportItem>>(
      `/api/reports/entity/${entity_type}/${entity_id}`,
      {
        params: {
          start_date: queryParams.start_date,
          end_date: queryParams.end_date,
          page: queryParams.page || 1,
          size: queryParams.size || 20,
        },
      }
    );
  },

  /**
   * Get endpoint report
   */
  getEndpointReport: async (
    params: EndpointReportParams
  ): Promise<PaginatedReportResponse<EndpointReportItem>> => {
    return await apiClient.get<PaginatedReportResponse<EndpointReportItem>>(
      "/api/reports/endpoint",
      {
        params: {
          endpoint: params.endpoint,
          start_date: params.start_date,
          end_date: params.end_date,
          page: params.page || 1,
          size: params.size || 20,
        },
      }
    );
  },

  /**
   * Get custom report
   */
  getCustomReport: async (
    request: CustomReportRequest,
    params: BaseReportParams = {}
  ): Promise<PaginatedReportResponse<Record<string, unknown>>> => {
    return await apiClient.post<
      PaginatedReportResponse<Record<string, unknown>>
    >("/api/reports/custom", request, {
      params: {
        page: params.page || 1,
        size: params.size || 20,
      },
    });
  },
};
