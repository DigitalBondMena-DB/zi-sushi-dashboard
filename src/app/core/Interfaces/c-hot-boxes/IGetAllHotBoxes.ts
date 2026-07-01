export interface IGetAllHotBoxes {
  hotboxes: HotboxData[];
}

export interface HotboxData {
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
  taxes_value: null;
  services_value: null;
  prices_after_taxes: null;
  created_at: string;
  updated_at: string;
}
