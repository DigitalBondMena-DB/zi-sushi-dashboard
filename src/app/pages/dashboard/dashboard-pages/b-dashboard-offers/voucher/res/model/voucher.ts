import { ActiveUser } from './activeUser';

export interface IVoucher {
  voucher: Voucher;
}

export interface Voucher {
  id: number;
  title_ar: string;
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
  users: ActiveUser[];
}
