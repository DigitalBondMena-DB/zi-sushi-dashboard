export interface IUpdateCategoryResponse {
  category: Category;
  success: string;
}

export interface Category {
  id: number;
  en_name: string;
  ar_name: string;
  state: string;
  created_at: string;
  updated_at: string;
}
