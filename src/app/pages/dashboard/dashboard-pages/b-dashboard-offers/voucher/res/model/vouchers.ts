export interface IVouchers {
  vouchers: Vouchers;
}
export interface Vouchers {
  current_page: number;
  data: Daum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: any;
  path: string;
  per_page: string;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface Daum {
  id: number;
  title_en: string;
  value: number;
  type: string;
  apply: string;
  use: string;
  status: number;
  limit: number;
  min_amount: number;
  created_at: string;
  updated_at: string;
  expiration_date: string;
}
