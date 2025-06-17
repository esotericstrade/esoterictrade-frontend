import { apiClient } from "../apiClient";

export const dashboardService = {
  /**
   * Get user count statistics (total, active, admin)
   * Admin access only
   */
  getUserCountStatistics: async (): Promise<UserCountStatistics> => {
    return await apiClient.get<UserCountStatistics>(
      "/api/dashboard/count/users"
    );
  },

  /**
   * Get broker account count statistics
   * Admins see system-wide data, users see only their own accounts
   */
  getBrokerAccountCountStatistics:
    async (): Promise<BrokerAccountCountStatistics> => {
      return await apiClient.get<BrokerAccountCountStatistics>(
        "/api/dashboard/count/broker-accounts"
      );
    },

  /**
   * Get subscription count statistics
   * Admins see all subscriptions, users see only their own
   */
  getSubscriptionCountStatistics:
    async (): Promise<SubscriptionCountStatistics> => {
      return await apiClient.get<SubscriptionCountStatistics>(
        "/api/dashboard/count/subscriptions"
      );
    },

  /**
   * Get actor count statistics
   * Admins see all actors, users see only actors they're subscribed to
   */
  getActorCountStatistics: async (): Promise<ActorCountStatistics> => {
    return await apiClient.get<ActorCountStatistics>(
      "/api/dashboard/count/actors"
    );
  },

  /**
   * Get strategy count statistics
   * Same data for all authenticated users
   */
  getStrategyCountStatistics: async (): Promise<StrategyCountStatistics> => {
    return await apiClient.get<StrategyCountStatistics>(
      "/api/dashboard/count/strategies"
    );
  },

  /**
   * Get all dashboard statistics in a single call
   * Makes multiple API calls in parallel and combines the results
   */
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const [users, brokerAccounts, subscriptions, actors, strategies] =
      await Promise.all([
        dashboardService.getUserCountStatistics(),
        dashboardService.getBrokerAccountCountStatistics(),
        dashboardService.getSubscriptionCountStatistics(),
        dashboardService.getActorCountStatistics(),
        dashboardService.getStrategyCountStatistics(),
      ]);

    return {
      users,
      brokerAccounts,
      subscriptions,
      actors,
      strategies,
    };
  },
};
