export interface IAddCategoryResponse {
  category: Category;
  success: string;
}

export interface Category {
  en_name: string;
  ar_name: string;
  state: string;
  updated_at: string;
  created_at: string;
  id: number;
}
