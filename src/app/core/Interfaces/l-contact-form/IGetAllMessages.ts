export interface IGetAllMessages {
  rows: Row[];
}

export interface Row {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
}
