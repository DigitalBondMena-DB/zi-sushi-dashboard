export interface ITutorialAddResponse {
  ToutrialContent: ToutrialContent;
  success: string;
}

export interface ToutrialContent {
  en_title: string;
  ar_title: string;
  en_Text: string;
  content_type: string;
  updated_at: string;
  created_at: string;
  id: number;
}
