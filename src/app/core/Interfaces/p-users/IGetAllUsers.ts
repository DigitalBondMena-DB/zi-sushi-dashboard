export interface IGetAllUsers {
  rows: Rows;
}

export interface Rows {
  current_page: number;
  data: usersData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface usersData {
  id: number;
  name: string;
  phone: string;
  email: string;
  email_verified_at: null;
  role: string;
  branch_id: null | number;
  google_id: null;
  apple_id: null;
  device_token: null | string;
  admin_status: number;
  deactive_status: number;
  delete_status: number;
  forget_code: null | string;
  verify_code: null | number;
  verify_status: null | string;
  created_at: string;
  updated_at: string;
}
