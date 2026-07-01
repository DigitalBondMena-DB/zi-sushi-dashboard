export interface IGetAllSliders {
  sliders: Sliders;
}

export interface Sliders {
  current_page: number;
  data: ISliderData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ISliderData {
  id: number;
  ar_title: string | null;
  en_title: string | null;
  ar_text: string | null;
  en_text: string | null;
  image: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}
