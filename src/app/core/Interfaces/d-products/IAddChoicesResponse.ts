export interface IAddChoicesResponse {
  choice: Choice;
  success: string;
}

export interface Choice {
  product_id: number;
  status: string;
  en_name: string;
  ar_name: string;
  updated_at: string;
  created_at: string;
  id: number;
}
