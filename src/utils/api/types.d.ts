// Common response types
type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Auth types
type LoginRequest = {
  username_or_email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

type RefreshTokenRequest = {
  refresh_token: string;
};

type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};

// User types
type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type UpdateProfileRequest = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

type RegisterUserRequest = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: "admin" | "user";
};

// Strategy types
type Strategy = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type CreateStrategyRequest = {
  name: string;
  description: string;
};

type UpdateStrategyRequest = {
  name?: string;
  description?: string;
};

// Actor types
type Actor = {
  id: number;
  strategy_id: number;
  instrument_name: string;
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
};

type CreateActorRequest = {
  strategy_id: number;
  instrument_name: string;
  parameters: Record<string, any>;
};

type UpdateActorRequest = {
  name?: string;
  description?: string;
  instrument?: string;
  parameters?: Record<string, any>;
};

type ActorRunRequest = {
  actor_id: number;
  run_timestamp: string;
  result: string;
  details: string;
};

// Subscription types
type Subscription = {
  id: number;
  user_id: number;
  actor_id: number;
  quantity: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type CreateSubscriptionRequest = {
  actor_id: number;
  user_id?: number;
  quantity: number;
  start_date?: string;
  end_date?: string;
};

type UpdateSubscriptionRequest = {
  quantity?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
};

type ToggleSubscriptionRequest = {
  actor_id: number;
  user_id?: number;
};

// Broker Account types
type BrokerAccount = {
  id: number;
  user_id: number;
  broker_type: string;
  account_number: string;
  api_key: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
};

type CreateBrokerAccountRequest = {
  broker_type: string;
  account_number: string;
  api_key: string;
  api_secret: string;
  is_autologin?: boolean;
  metadata?: Record<string, any>;
};

type UpdateBrokerAccountRequest = {
  api_key?: string;
  api_secret?: string;
  is_autologin?: boolean;
  metadata?: Record<string, any>;
};

type UpdateOAuthTokensRequest = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};
