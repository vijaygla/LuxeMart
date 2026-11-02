from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class CategoryRead(CategoryBase):
    id: int
    product_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: str
    description: str
    price: float
    discount_price: Optional[float] = None
    category_id: int
    stock_quantity: int = 0
    sku: str
    image_url: str
    additional_images_json: Optional[str] = "[]"
    rating: float = 5.0
    review_count: int = 0
    is_featured: bool = False
    is_active: bool = True
    specs_json: Optional[str] = "{}"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    category_id: Optional[int] = None
    stock_quantity: Optional[int] = None
    sku: Optional[str] = None
    image_url: Optional[str] = None
    additional_images_json: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    specs_json: Optional[str] = None

class ReviewRead(BaseModel):
    id: int
    product_id: int
    user_id: int
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    rating: int
    comment: str

class ProductRead(ProductBase):
    id: int
    created_at: datetime
    category_name: Optional[str] = None
    reviews: Optional[List[ReviewRead]] = []

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductRead]
    total: int
    page: int
    page_size: int
    pages: int
