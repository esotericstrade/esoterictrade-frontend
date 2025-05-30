/**
 * Webhook service type declarations
 */

/**
 * Base webhook payload interface that all webhook types should extend
 */
interface BaseWebhookPayload {
  type: string;
  symbol: string;
  exchange: string;
  product: string;
}

/**
 * Trading view webhook payload
 */
interface TradingViewWebhookPayload extends BaseWebhookPayload {
  qty?: string;
  action?: string;
  target?: string;
  stop?: string;
}

/**
 * GTT related webhook payload
 */
interface GTTWebhookPayload {
  instrument: string;
  ltp: string;
  new_target: string;
  new_stoploss: string;
}

/**
 * Webhook response interface
 */
interface WebhookResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Webhook verification request
 */
interface VerifyWebhookRequest extends BaseWebhookPayload {
  broker_id?: number;
}

/**
 * Type for webhook callbacks response
 */
type WebhookCallbacksResponse = {
  id: number;
  endpoint: string;
  created_at: string;
  last_called_at: string;
  call_count: number;
  status: "active" | "inactive";
  description?: string;
}[];
