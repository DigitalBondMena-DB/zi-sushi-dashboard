export interface IGetSubLocationById {
  sublocation: Sublocation;
  locations: Location[];
  branches: Branch[];
}

export interface Branch {
  id: number;
  en_branch_location: string;
  ar_branch_location: string;
  en_branch_city: string;
  ar_branch_city: string;
  en_branch_address: string;
  ar_branch_address: string;
  branch_phone_1: string;
  branch_phone_2: string;
  branch_phone_3: null | string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  en_location: string;
  ar_location: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Sublocation {
  id: number;
  en_sub_location: string;
  ar_sub_location: string;
  location_id: number;
  price: number;
  branch_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}
