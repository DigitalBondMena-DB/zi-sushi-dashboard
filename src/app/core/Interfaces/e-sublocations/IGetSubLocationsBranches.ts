export interface IGetSubLocationsBranches {
  locations: ILocation[];
  branches: IBranch[];
}

export interface IBranch {
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

export interface ILocation {
  id: number;
  en_location: string;
  ar_location: string;
  status: number;
  created_at: string;
  updated_at: string;
}
