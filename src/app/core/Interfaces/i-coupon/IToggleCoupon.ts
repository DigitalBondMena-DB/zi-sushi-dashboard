export interface IToggleCoupon {
  coupon: Coupon;
  success: string;
}

export interface Coupon {
  id: number;
  code: string;
  percentage: number;
  status: number;
  counter_use: number;
  created_at: string;
  updated_at: string;
}
