export interface IUpdateCouponResponse {
  coupon: Coupon;
  success: string;
}

export interface Coupon {
  id: number;
  code: string;
  percentage: string;
  status: string;
  counter_use: string;
  created_at: string;
  updated_at: string;
}
