export interface IAddProductBody {
  image: File;
  piece_price_array: string;
  product_choice_array: string;
  category_id: string;
  en_food_name: string;
  ar_food_name: string;
  en_ingredients: string;
  ar_ingredients: string;
  piece_price_state: string;
  product_choice_state: string;
  state: string;
}
