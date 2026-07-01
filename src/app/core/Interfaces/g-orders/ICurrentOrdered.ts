export interface ICurrentOrdered {
  orders: NewOrders[];
}

export interface NewOrders {
  id: number;
  user_id: number;
  branch_id: number;
  address_id: null;
  address_information: null;
  location_id: null;
  location_title: null;
  sub_location_id: null;
  sub_location_title: null;
  total_price: number;
  sub_total: null | number;
  confirmed_by_user: number;
  status: string;
  combo_id: null;
  combo_name: null;
  promo_code_id: null;
  order_date: string;
  order_time: null;
  created_at: string;
  updated_at: string;
  date: string;
  time: string;
  user: User | null;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  email_verified_at: null;
  role: string;
  branch_id: number;
  google_id: null;
  apple_id: null;
  device_token: null;
  admin_status: number;
  deactive_status: number;
  delete_status: number;
  forget_code: null;
  verify_code: null;
  verify_status: null;
  created_at: string;
  updated_at: string;
}
