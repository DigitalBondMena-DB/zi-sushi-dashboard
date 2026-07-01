export interface IBranchById {
  branches: Branches;
}

export interface Branches {
  id: number;
  en_branch_location: string;
  ar_branch_location: string;
  en_branch_city: string;
  ar_branch_city: string;
  en_branch_address: string;
  ar_branch_address: string;
  en_close_message: string;
  ar_close_message: string;
  location_url: string;
  branch_phone_1: string;
  branch_phone_2: string;
  branch_phone_3: null;
  status: number;
  created_at: string;
  updated_at: string;
}
