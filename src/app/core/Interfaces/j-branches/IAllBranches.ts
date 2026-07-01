export interface IAllBranches {
  branches: Branches;
}

export interface Branches {
  current_page: number;
  data: BranchesData[];
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

export interface BranchesData {
  id: number;
  en_branch_location: string;
  ar_branch_location: string;
  en_branch_city: string;
  ar_branch_city: string;
  en_branch_address: string;
  ar_branch_address: string;
  branch_phone_1: string;
  branch_phone_2: string;
  branch_phone_3: null;
  status: number;
  created_at: string;
  updated_at: string;
}
