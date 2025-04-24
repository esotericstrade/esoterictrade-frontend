/**
 * Subscription service type declarations
 */

/**
 * Represents a subscription in the system
 */
interface Subscription {
  id: number;
  user_id: number;
  actor_id: number;
  quantity: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents the request body for creating a subscription
 */
interface CreateSubscriptionRequest {
  actor_id: number;
  user_id?: number;
  quantity: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Represents the request body for updating a subscription
 */
interface UpdateSubscriptionRequest {
  quantity?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

/**
 * Represents the request body for toggling a subscription
 */
interface ToggleSubscriptionRequest {
  actor_id: number;
  user_id?: number;
}
