export interface ILogInResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  email_verified_at: null;
  role: string;
  branch_id: null;
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
