export interface IToggleComboOffer {
  combo: Combo;
  success: string;
}

export interface Combo {
  id: number;
  pieces: number;
  prices: number;
  en_name: string;
  ar_name: string;
  status: number;
  created_at: string;
  updated_at: string;
}
