export interface IGetUserById {
  row: Row;
}

export interface Row {
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
  created_at: string;
  updated_at: string;
  confirmed_orders: IUserOrders[];
  addresses: IUSerAddress[];
}

export interface IUSerAddress {
  id: number;
  user_id: number;
  location_id: number;
  sub_location_id: number;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface IUserOrders {
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
  sub_total: number;
  confirmed_by_user: number;
  status: string;
  combo_id: null;
  combo_name: null;
  promo_code_id: null;
  order_date: string;
  created_at: string;
  updated_at: string;
  date: string;
  time: string;
}
