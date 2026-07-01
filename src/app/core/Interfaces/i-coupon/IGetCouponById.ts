export interface IGetCouponById {
  coupon: Coupon;
}

export interface Coupon {
  id: number;
  code: string;
  percentage: number;
  status: number;
  counter_use: null;
  created_at: string;
  updated_at: string;
}
