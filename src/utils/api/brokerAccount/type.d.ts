/**
 * Broker Account service type declarations
 */

/**
 * Represents a broker account in the system
 */
interface BrokerAccount {
  id: number;
  user_id: number;
  broker_type: string;
  account_number: string;
  api_key: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Represents the request body for creating a broker account
 */
interface CreateBrokerAccountRequest {
  broker_type: string;
  account_number: string;
  api_key: string;
  api_secret: string;
  is_autologin?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Represents the request body for updating a broker account
 */
interface UpdateBrokerAccountRequest {
  api_key?: string;
  api_secret?: string;
  is_autologin?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Represents the request body for updating OAuth tokens
 */
interface UpdateOAuthTokensRequest {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
