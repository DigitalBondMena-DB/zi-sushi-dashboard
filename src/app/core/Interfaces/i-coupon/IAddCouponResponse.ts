export interface IAddCouponResponseError {
  errors: Errors;
}

export interface Errors {
  code: string[];
}

export interface IAddCouponResponse {
  coupon: Coupon;
  success: string;
}

export interface Coupon {
  code: string;
  percentage: string;
  status: string;
  counter_use: string;
  updated_at: string;
  created_at: string;
  id: number;
}
