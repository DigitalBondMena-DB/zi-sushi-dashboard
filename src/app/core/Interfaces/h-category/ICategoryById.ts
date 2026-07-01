export interface ICategoryById {
  category: Category;
  success: string;
}

export interface Category {
  id: number;
  en_name: string;
  ar_name: string;
  state: number;
  created_at: string;
  updated_at: string;
}
