from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class OrderItemRead(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_image: str
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    shipping_name: str
    shipping_address: str
    shipping_city: str
    shipping_state: Optional[str] = ""
    shipping_postal_code: str
    shipping_phone: str
    payment_method: str = "Credit Card"  # Credit Card, Debit Card, UPI, Net Banking, COD

class OrderStatusUpdate(BaseModel):
    status: str  # Pending, Processing, Shipped, Delivered, Cancelled
    payment_status: Optional[str] = None

class OrderRead(BaseModel):
    id: int
    user_id: int
    order_number: str
    subtotal_amount: float
    discount_amount: float
    shipping_fee: float
    tax_amount: float
    total_amount: float
    status: str
    shipping_name: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_postal_code: str
    shipping_phone: str
    payment_method: str
    payment_status: str
    created_at: datetime
    items: List[OrderItemRead] = []

    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    orders: List[OrderRead]
    total: int
