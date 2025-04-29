type ActorParameters = {
  ltp: string;
  stoploss: string;
  target: string;
};

interface Actor {
  id: number;
  name: string;
  strategy_id: number;
  instrument_name: string;
  parameters: ActorParameters;
  created_at: string;
  updated_at: string;
}

interface CreateActorRequest {
  strategy_id: number;
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
