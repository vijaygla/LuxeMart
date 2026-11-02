import { Order } from './order.model';
import { Product } from './product.model';

export interface CategorySales {
  category_name: string;
  product_count: number;
  total_sales: number;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_users: number;
  pending_orders: number;
  low_stock_count: number;
  low_stock_products: Product[];
  recent_orders: Order[];
  category_sales: CategorySales[];
}
