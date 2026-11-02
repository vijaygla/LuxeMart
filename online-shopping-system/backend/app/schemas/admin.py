from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.order import OrderRead
from app.schemas.catalog import ProductRead

class CategorySales(BaseModel):
    category_name: str
    product_count: int
    total_sales: float

class DashboardStatsRead(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    total_users: int
    pending_orders: int
    low_stock_count: int
    low_stock_products: List[ProductRead] = []
    recent_orders: List[OrderRead] = []
    category_sales: List[CategorySales] = []
