from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True, max_length=150)
    slug: str = Field(index=True, unique=True, max_length=150)
    description: Optional[str] = Field(default=None, max_length=1000)
    image_url: Optional[str] = Field(default=None, max_length=1000)
    is_active: bool = Field(default=True)

class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)
    slug: str = Field(index=True, unique=True, max_length=255)
    description: str = Field(max_length=4000)
    price: float = Field(default=0.0)
    discount_price: Optional[float] = Field(default=None)
    category_id: int = Field(foreign_key="categories.id", index=True)
    stock_quantity: int = Field(default=0)
    sku: str = Field(unique=True, index=True, max_length=100)
    image_url: str = Field(max_length=1000)
    additional_images_json: Optional[str] = Field(default="[]", max_length=4000)
    rating: float = Field(default=5.0)
    review_count: int = Field(default=0)
    is_featured: bool = Field(default=False)
    is_active: bool = Field(default=True)
    specs_json: Optional[str] = Field(default="{}", max_length=4000)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
