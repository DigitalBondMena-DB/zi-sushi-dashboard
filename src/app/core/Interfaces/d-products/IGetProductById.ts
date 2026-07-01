export interface IGetProductById {
  product: Product;
  productCategory: Category;
  piecesPrices: PiecesPrice[];
  choices: Choice[];
  categories: Category[];
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

export interface PiecesPrice {
  id: number;
  product_id: number;
  pieces: number;
  prices: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  en_food_name: string;
  ar_food_name: string;
  en_ingredients: string;
  ar_ingredients: string;
  image: string;
  price: null;
  piece_price_state: number;
  product_choice_state: number;
  product_counter: number;
  status: number;
  category_id: number;
  taxes_value: null;
  services_value: null;
  prices_after_taxes: null;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface Category {
  id: number;
  en_name: string;
  ar_name: string;
  state: number;
  created_at: string;
  updated_at: string;
}
