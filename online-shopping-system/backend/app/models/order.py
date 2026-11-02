from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True, foreign_key="users.id")
    order_number: str = Field(unique=True, index=True, max_length=100)
    total_amount: float = Field(default=0.0)
    subtotal_amount: float = Field(default=0.0)
    discount_amount: float = Field(default=0.0)
    shipping_fee: float = Field(default=0.0)
    tax_amount: float = Field(default=0.0)
    status: str = Field(default="Processing", max_length=50)  # Pending, Processing, Shipped, Delivered, Cancelled
    
    # Shipping info
    shipping_name: str = Field(max_length=200)
    shipping_address: str = Field(max_length=500)
    shipping_city: str = Field(max_length=100)
    shipping_state: str = Field(default="", max_length=100)
    shipping_postal_code: str = Field(max_length=50)
    shipping_phone: str = Field(max_length=50)
    
    # Payment info
    payment_method: str = Field(default="Credit Card", max_length=50)  # Credit Card, Debit Card, UPI, Net Banking, COD
    payment_status: str = Field(default="Paid", max_length=50)  # Paid, Pending, Failed, Refunded

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id", index=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    product_name: str = Field(max_length=255)
    product_image: str = Field(max_length=1000)
    quantity: int = Field(default=1)
    unit_price: float = Field(default=0.0)
    total_price: float = Field(default=0.0)
