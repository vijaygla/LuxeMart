import { Product } from './product.model';

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  subtotal: number;
  shipping_fee: number;
  discount: number;
  estimated_tax: number;
  total: number;
  item_count: number;
}
