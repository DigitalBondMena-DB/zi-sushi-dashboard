export interface IGetAllTutorials {
  content: Content;
}

export interface Content {
  current_page: number;
  data: tutorialData[];
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

export interface tutorialData {
  id: number;
  en_title: string;
  ar_title: string;
  en_Text: string;
  ar_text: null;
  content_type: string;
  created_at: string;
  updated_at: string;
}
