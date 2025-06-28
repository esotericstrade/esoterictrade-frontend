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

type CumulativePnL = {
  total_pnl: number;
  total_users: number;
  total_positions: number;
  // user_wise_pnl: UserWisePnl[];
  // statistics: Statistics;
};

type Statistics = {
  profitable_users: number;
  losing_users: number;
  breakeven_users: number;
  max_profit: number;
  max_loss: number;
  average_pnl: number;
  successful_users: number;
  failed_users: number;
};

type UserWisePnl = {
  username: string;
  status: Status;
  user_id: number;
  total_pnl: number;
  position_count: number;
  unrealised_pnl: number;
  realised_pnl: number;
  error_message: null;
};

type Status = "SUCCESS" | "FAILED";
