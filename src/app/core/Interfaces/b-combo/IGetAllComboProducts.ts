export interface Category {
  id: number;
  en_name: string;
  ar_name: string;
  state: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  en_food_name: string;
  ar_food_name: string;
  en_ingredients?: any;
  ar_ingredients?: any;
  image: string;
  price: number;
  piece_price_state: number;
  product_choice_state: number;
  product_counter: number;
  status: number;
  category_id: number;
  taxes_value?: any;
  services_value?: any;
  prices_after_taxes?: any;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  category: Category;
  products_pieces: any[];
  choices: any[];
}

export interface IGetAllComboProducts {
  products: Product[];
}
