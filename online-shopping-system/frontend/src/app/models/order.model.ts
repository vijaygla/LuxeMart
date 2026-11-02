export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  subtotal_amount: number;
  discount_amount: number;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code: string;
  shipping_phone: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

export interface CheckoutRequest {
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code: string;
  shipping_phone: string;
  payment_method: string;
}

export interface PaymentRequest {
  order_id: number;
  payment_method: string;
  card_number?: string;
  card_holder?: string;
  expiry?: string;
  cvv?: string;
  upi_id?: string;
}
