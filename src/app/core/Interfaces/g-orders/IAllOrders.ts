
export interface IAllOrders {
  orders: Orders
}

export interface Orders {
  current_page: number
  data: OrderData[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string
  path: string
  per_page: string
  prev_page_url: any
  to: number
  total: number
}

export interface OrderData {
  id: number
  user_id: number
  branch_id: number
  address_id: number
  address_information: string
  location_id: number
  location_title: string
  sub_location_id: number
  sub_location_title: string
  total_price: number
  sub_total: number
  taxes_value: number
  taxes_money: number
  service_value: number
  service_money: number
  delivry_value: number
  confirmed_by_user: number
  status: string
  combo_id?: number
  combo_name?: string
  combo_value?: string
  promo_code_id: any
  promo_code_name: any
  promo_code_value: number
  order_date: string
  order_time: string
  note_text?: string
  created_at: string
  updated_at: string
  zi_applied_points: number
  zi_earned_points: number
  zi_final_spend: number
  voucher_id: any
  voucher_discount: number
  happy_hours_discount: string
  zi_points_discount: string
  app_discount?: string
  date: string
  time: string
  user: User
  sublocationinfo: Sublocationinfo
  addressinfo: Addressinfo
  branch: Branch
}

export interface User {
  id: number
  name: string
  phone?: string
  email?: string
  email_verified_at: any
  role: string
  branch_id: any
  google_id?: string
  apple_id?: string
  device_token?: string
  admin_status: number
  deactive_status: number
  delete_status: number
  forget_code?: string
  verify_code: number
  verify_status: string
  created_at: string
  updated_at: string
}

export interface Sublocationinfo {
  id: number
  en_sub_location: string
  ar_sub_location: string
  location_id: number
  price: number
  branch_id: number
  status: number
  created_at: string
  updated_at: string
}

export interface Addressinfo {
  id: number
  user_id: number
  location_id: number
  sub_location_id: number
  phone: string
  address_type: string
  address: string
  active_status: number
  created_at: string
  updated_at: string
}

export interface Branch {
  id: number
  en_branch_location: string
  ar_branch_location: string
  en_branch_city: string
  ar_branch_city: string
  en_branch_address: string
  ar_branch_address: string
  branch_phone_1: string
  branch_phone_2: string
  branch_phone_3?: string
  location_url: string
  ar_close_message: string
  en_close_message: string
  status: number
  created_at: string
  updated_at: string
}



export interface Branches {
  id: number;
  en_branch_location: string;
  ar_branch_location: string;
  en_branch_city: string;
  ar_branch_city: string;
  en_branch_address: string;
  ar_branch_address: string;
  branch_phone_1: string;
  branch_phone_2: string;
  branch_phone_3: string;
  location_url: null;
  status: number;
  created_at: string;
  updated_at: string;
}
