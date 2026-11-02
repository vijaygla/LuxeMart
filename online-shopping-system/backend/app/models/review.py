from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class ProductReview(SQLModel, table=True):
    __tablename__ = "product_reviews"

    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    user_name: str = Field(max_length=150)
    rating: int = Field(default=5)  # 1 to 5
    comment: str = Field(max_length=2000)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
