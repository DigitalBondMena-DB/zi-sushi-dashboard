export interface IGetAllProducts {
  products: Products;
}

export interface Products {
  current_page: number;
  data: productsData[];
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

export interface productsData {
  id: number;
  en_food_name: string;
  ar_food_name: string;
  en_ingredients: string;
  ar_ingredients: string;
  image: string;
  price: null | number;
  piece_price_state: number;
  product_choice_state: number;
  product_counter: number;
  status: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: Category;
  products_pieces: ProductsPieces[];
  choices: Choice[];
}

export interface ProductsPieces {
  id: number;
  product_id: number;
  pieces: string;
  prices: string;
  status: number;
  created_at: string;
  updated_at: string;
}
export interface Choice {
  id: number;
  product_id: number;
  en_name: string;
  ar_name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  en_name: string;
  ar_name: string;
  state: number;
  created_at: string;
  updated_at: string;
}
