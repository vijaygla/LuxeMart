from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Cart(SQLModel, table=True):
    __tablename__ = "carts"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(unique=True, index=True, foreign_key="users.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItem(SQLModel, table=True):
    __tablename__ = "cart_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    cart_id: int = Field(foreign_key="carts.id", index=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    quantity: int = Field(default=1)
    unit_price: float = Field(default=0.0)
