export interface IUpdateComboResponse {
  combo: Combo;
  success: string;
}

export interface Combo {
  id: number;
  pieces: string;
  prices: string;
  en_name: string;
  ar_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}
