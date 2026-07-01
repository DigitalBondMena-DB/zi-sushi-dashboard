import { ActiveUser } from './activeUser';

export interface IPromoCode {
  promo_code: PromoCode;
}

export interface PromoCode {
  id?: number;
  code: string;
  expiration_date: any;
  status: number;
  type: string;
  use: string;
  limit: any;
  min_amount: number;
  value: number;
  apply: string;
  users: ActiveUser[];
}
