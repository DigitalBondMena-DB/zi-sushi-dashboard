export interface IAllCoupons {
  coupons: Coupons;
}

export interface Coupons {
  current_page: number;
  data: couponData[];
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

export interface couponData {
  id: number;
  code: string;
  percentage: number;
  status: number;
  counter_use: null | number;
  created_at: string;
  updated_at: string;
}
