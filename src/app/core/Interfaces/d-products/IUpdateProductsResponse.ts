export interface IUpdateProductsResponse {
  product: Product;
  success: string;
}

export interface Product {
  id: number;
  en_food_name: string;
  ar_food_name: string;
  en_ingredients: string;
  ar_ingredients: string;
  image: string;
  price: null;
  piece_price_state: string;
  product_choice_state: string;
  product_counter: number;
  status: number;
  category_id: string;
  created_at: string;
  updated_at: string;
}
