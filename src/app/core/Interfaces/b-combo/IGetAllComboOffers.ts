export interface IGetAllComboOffers {
  combos: Combos;
}

export interface Combos {
  current_page: number;
  data: ComboData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface ComboData {
  id: number;
  pieces: number;
  prices: number;
  en_name: string;
  ar_name: string;
  status: number;
  created_at: string;
  updated_at: string;
  limits: Limit[];
}

export interface Limit {
  id: number;
  combo_id: number;
  category_id: number;
  limit_count: number;
  created_at: string;
  updated_at: string;
}
