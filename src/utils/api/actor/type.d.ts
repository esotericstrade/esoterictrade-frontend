interface Actor {
  id: number;
  strategy_id: number;
  instrument_name: string;
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CreateActorRequest {
  strategy_id: number;
  instrument_name: string;
  parameters: Record<string, any>;
}

interface UpdateActorRequest {
  name?: string;
  description?: string;
  instrument?: string;
  parameters?: Record<string, any>;
}

interface ActorRunRequest {
  actor_id: number;
  run_timestamp: string;
  result: string;
  details: string;
}
