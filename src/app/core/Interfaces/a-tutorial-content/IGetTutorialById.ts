export interface IGetTutorialById {
  ToutrialContent: ToutrialContent;
  success: string;
}

export interface ToutrialContent {
  id: number;
  en_title: string;
  ar_title: string;
  en_Text: string;
  ar_text: null;
  content_type: string;
  created_at: string;
  updated_at: string;
}
