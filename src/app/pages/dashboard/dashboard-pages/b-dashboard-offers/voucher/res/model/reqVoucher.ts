export interface IAddVoucher {
  type: string;
  use: string;
  apply: string;
  value: number;
  min_amount: number;
  title_ar: string;
  title_en: string;
  limit: number;
  status: number;
  users: number[];
  expiration_date: string;
}
