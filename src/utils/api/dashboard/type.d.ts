// Dashboard API types

// Base count statistics type
type BaseCountStatistics = {
  entity_type: string;
};

// User count statistics
type UserCountStatistics = BaseCountStatistics & {
  total_count: number;
  active_count: number;
  admin_count: number;
  entity_type: "user";
};

// Broker account count statistics
type BrokerAccountCountStatistics = BaseCountStatistics & {
  total_count: number;
  active_count: number;
  entity_type: "broker_account";
  is_admin_view: boolean;
  user_id?: number;
};

// Subscription count statistics
type SubscriptionCountStatistics = BaseCountStatistics & {
  total_count: number;
  active_count: number;
  entity_type: "subscription";
  is_admin_view: boolean;
  user_id?: number;
};

// Actor count statistics
type ActorCountStatistics = BaseCountStatistics & {
  total_count: number;
  strategy_count: number;
  entity_type: "actor";
  is_admin_view: boolean;
  user_id?: number;
};

// Strategy count statistics
type StrategyCountStatistics = BaseCountStatistics & {
  total_count: number;
  entity_type: "strategy";
};

// Dashboard summary containing all statistics
type DashboardSummary = {
  users: UserCountStatistics;
  brokerAccounts: BrokerAccountCountStatistics;
  subscriptions: SubscriptionCountStatistics;
  actors: ActorCountStatistics;
  strategies: StrategyCountStatistics;
};
