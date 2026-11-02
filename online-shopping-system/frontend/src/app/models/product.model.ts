export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  product_count?: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id: number;
  category_name?: string;
  stock_quantity: number;
  sku: string;
  image_url: string;
  additional_images_json?: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_active: boolean;
  specs_json?: string;
  created_at: string;
  reviews?: Review[];
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
