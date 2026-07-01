export interface IGetComboOfferById {
  combo: Combo;
}

export interface Combo {
  id: number;
  pieces: number;
  prices: number;
  en_name: string;
  getproduct: Getproduct;
  ar_name: string;
  status: number;
  created_at: string;
  updated_at: string;
  limits: Limit[];
}

export interface Limit {
  id: number;
  combo_id: number;
  category_id: number;
  limit_count: number;
  created_at: string;
  updated_at: string;
}

export interface Getproduct {
	id: number;
	en_food_name: string;
	ar_food_name: string;
	en_ingredients: string;
	ar_ingredients: string;
	image: string;
	price?: any;
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
}

