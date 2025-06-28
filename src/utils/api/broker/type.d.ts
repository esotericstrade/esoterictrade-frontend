type Position = {
  product: string;
  exchange: string;
  sell_value: number;
  last_price: number;
  unrealised: number;
  buy_price: number;
  sell_price: number;
  m2m: number;
  trading_symbol: string;
  net_quantity: number;
  sell_quantity: number;
  realised: number;
  buy_quantity: number;
  net_value: null;
  buy_value: number;
  multiplier: number;
  instrument_token: string;
  close_price: number;
  pnl: number;
  overnight_quantity: number;
  buym2m: number;
  sellm2m: number;
  day_buy_quantity: number;
  day_sell_quantity: number;
  day_buy_price: number;
  day_sell_price: number;
  day_buy_value: number;
  day_sell_value: number;
  value: number;
  average_price: number;
};

type PnLSummary = {
  total_pnl: number;
  position_count: number;
  unrealised_pnl: number;
  realised_pnl: number;
  profitable_positions: number;
  losing_positions: number;
  max_position_profit: number;
  max_position_loss: number;
};

type Holding = {
  // Add holding fields based on your API response
  id: string;
  // Add other holding fields
};

type Margin = {
  // Add margin fields based on your API response
  id: string;
  // Add other margin fields
};

type PaginatedResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};
