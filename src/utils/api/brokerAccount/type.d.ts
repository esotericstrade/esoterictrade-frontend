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
  api_key?: string;
  is_active: boolean;
  has_api_key: boolean;
  has_api_secret: boolean;
  has_access_token: boolean;
  has_refresh_token: boolean;
  token_expires_at: string | null;
  metadata: {
    tokens?: {
      password?: string;
      mfa_secret?: string;
    };
    description?: string;
    descritpion?: string; // Keep both spellings as API has typo
    is_autologin?: string;
    account_nickname?: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Represents the request body for creating a broker account
 */
interface CreateBrokerAccountRequest {
  user_id?: number;
  broker_type: string;
  account_number: string;
  api_key?: string;
  api_secret?: string;
  password?: string;
  mfa_secret?: string;
  is_autologin?: boolean;
  account_nickname?: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Represents the request body for updating a broker account
 */
interface UpdateBrokerAccountRequest {
  api_key?: string;
  api_secret?: string;
  password?: string;
  mfa_secret?: string;
  is_autologin?: boolean;
  account_nickname?: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Represents the request body for updating OAuth tokens
 */
interface UpdateOAuthTokensRequest {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}