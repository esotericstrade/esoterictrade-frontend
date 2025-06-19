type ActorParameters = {
  ltp: string;
  stoploss: string;
  target: string;
  tick_size: string;
};

interface Actor {
  id: number;
  name: string;
  strategy_id: number;
  strategy_name: string;
  instrument_name: string;
  parameters: ActorParameters;
  created_at: string;
  updated_at: string;
}

interface GetAllActorsParams {
  page: number;
  limit: number;
  strategyId?: number;
  instrument?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

interface CreateActorRequest {
  strategy_id: number;
  name: string;
  instrument_name: string;
  parameters: ActorParameters;
}

interface UpdateActorRequest {
  name?: string;
  description?: string;
  instrument?: string;
  parameters?: ActorParameters;
}

interface ActorRunRequest {
  actor_id: number;
  run_timestamp: string;
  result: string;
  details: string;
}
