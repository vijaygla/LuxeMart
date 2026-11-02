from typing import List, Optional
from pydantic import BaseModel
from app.schemas.catalog import ProductRead

class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemRead(BaseModel):
    id: int
    cart_id: int
    product_id: int
    quantity: int
    unit_price: float
    total_price: float
    product: Optional[ProductRead] = None

    class Config:
        from_attributes = True

class CartRead(BaseModel):
    id: int
    user_id: int
    items: List[CartItemRead] = []
    subtotal: float = 0.0
    shipping_fee: float = 0.0
    discount: float = 0.0
    estimated_tax: float = 0.0
    total: float = 0.0
    item_count: int = 0
