/**
 * Subscription service type declarations
 */

/**
 * Represents a subscription in the system
 */
type Subscription = {
  actor: Actor;
  actor_id: number;
  name: string;
  created_at: Date;
  custom_parameters: null;
  effective_parameters: Parameters;
  id: number;
  is_active: boolean;
  quantity: number;
  updated_at: Date;
  user_id: number;
};

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
