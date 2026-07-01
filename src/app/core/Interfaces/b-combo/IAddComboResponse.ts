export interface IAddComboResponse {
  combo: Combo;
  success: string;
}

export interface Combo {
  pieces: string;
  prices: string;
  en_name: string;
  ar_name: string;
  status: string;
  updated_at: string;
  created_at: string;
  id: number;
}
