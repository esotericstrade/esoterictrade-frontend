interface Strategy {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CreateStrategyRequest {
  name: string;
  description: string;
}

interface UpdateStrategyRequest {
  name?: string;
  description?: string;
}
