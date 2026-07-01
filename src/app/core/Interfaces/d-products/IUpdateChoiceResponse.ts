export interface IUpdateChoiceResponse {
  choice: Choice;
  success: string;
}

export interface Choice {
  id: number;
  product_id: number;
  en_name: string;
  ar_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}
