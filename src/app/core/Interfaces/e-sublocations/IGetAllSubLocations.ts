export interface IGetAllSubLocations {
  sublocations: Sublocations;
}

export interface Sublocations {
  current_page: number;
  data: ISubLocationData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface ISubLocationData {
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
