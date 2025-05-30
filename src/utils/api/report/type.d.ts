/**
 * Report service type declarations
 */

/**
 * Common report query parameters
 */
interface BaseReportParams {
  page?: number;
  size?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * User activity report query parameters
 */
interface UserActivityReportParams extends BaseReportParams {
  user_id?: number;
}

/**
 * Subscription report query parameters
 */
interface SubscriptionReportParams extends BaseReportParams {
  user_id?: number;
  actor_id?: number;
}

/**
 * Trade report query parameters
 */
interface TradeReportParams extends BaseReportParams {
  symbol?: string;
}

/**
 * Entity report query parameters
 */
interface EntityReportParams extends BaseReportParams {
  entity_type: 'actor' | 'strategy' | 'user' | 'subscription';
  entity_id: number;
}

/**
 * Endpoint report query parameters
 */
interface EndpointReportParams extends BaseReportParams {
  endpoint: string;
}

/**
 * Custom report request body
 */
interface CustomReportRequest {
  start_date?: string;
  end_date?: string;
  user_ids?: number[];
  entity_types?: string[];
  action_types?: string[];
  status_codes?: number[];
  include_request_data?: boolean;
  include_response_data?: boolean;
}

/**
 * Generic paginated report response
 */
interface PaginatedReportResponse<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
  total_pages: number;
}

/**
 * User activity report item
 */
interface UserActivityReportItem {
  id: number;
  user_id: number;
  username: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: string;
  ip_address?: string;
}

/**
 * Subscription report item
 */
interface SubscriptionReportItem {
  id: number;
  user_id: number;
  username: string;
  actor_id: number;
  actor_name: string;
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated';
  details: Record<string, unknown>;
  timestamp: string;
}

/**
 * Trade report item
 */
interface TradeReportItem {
  id: number;
  user_id: number;
  username: string;
  symbol: string;
  exchange: string;
  product: string;
  type: string;
  quantity: number;
  price: number;
  status: string;
  timestamp: string;
}

/**
 * Entity report item (generic for any entity type)
 */
interface EntityReportItem {
  id: number;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  action: string;
  user_id: number;
  username: string;
  details: Record<string, unknown>;
  timestamp: string;
}

/**
 * Endpoint report item
 */
interface EndpointReportItem {
  id: number;
  endpoint: string;
  method: string;
  status_code: number;
  user_id?: number;
  username?: string;
  request_data?: Record<string, unknown>;
  response_data?: Record<string, unknown>;
  duration_ms: number;
  timestamp: string;
  ip_address?: string;
}
