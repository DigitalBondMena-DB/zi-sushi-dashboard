export interface IUpdateUserResponse {
  user: User;
  success: string;
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
  admin_status: string;
  created_at: string;
  updated_at: string;
}
