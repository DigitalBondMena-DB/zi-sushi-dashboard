export interface IAddBoxResponse {
  product: Product;
  success: string;
}

export interface Product {
  image: string;
  category_id: string;
  en_food_name: string;
  ar_food_name: string;
  en_ingredients: string;
  ar_ingredients: string;
  price: string;
  piece_price_state: string;
  product_choice_state: string;
  updated_at: string;
  created_at: string;
  id: number;
}
