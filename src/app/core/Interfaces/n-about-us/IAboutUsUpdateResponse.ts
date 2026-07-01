export interface IAboutUsUpdateResponse {
  about: About;
  success: string;
}

export interface About {
  id: number;
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
  about_image: string;
  created_at: string;
  updated_at: string;
}
