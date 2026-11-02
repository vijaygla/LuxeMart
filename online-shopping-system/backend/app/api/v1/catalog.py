from typing import List, Optional
import math
from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session, select, func, or_
from app.db.session import get_session
from app.models.catalog import Category, Product
from app.models.review import ProductReview
from app.models.user import User
from app.schemas.catalog import (
    CategoryRead, CategoryCreate, CategoryUpdate,
    ProductRead, ProductCreate, ProductUpdate, ProductListResponse,
    ReviewRead, ReviewCreate
)
from app.core.exceptions import NotFoundException, BadRequestException
from app.api.deps import get_current_admin, get_current_user

router = APIRouter(prefix="/catalog", tags=["Catalog"])

# ----------------- CATEGORIES -----------------

@router.get("/categories", response_model=List[CategoryRead])
def get_categories(db: Session = Depends(get_session)):
    categories = db.exec(select(Category).where(Category.is_active == True)).all()
    results = []
    for c in categories:
        count = db.exec(
            select(func.count(Product.id)).where(Product.category_id == c.id, Product.is_active == True)
        ).one()
        cr = CategoryRead.model_validate(c)
        cr.product_count = count
        results.append(cr)
    return results

@router.post("/categories", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    existing = db.exec(select(Category).where(Category.slug == data.slug)).first()
    if existing:
        raise BadRequestException("Category slug already exists")

    cat = Category.model_validate(data)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    cr = CategoryRead.model_validate(cat)
    cr.product_count = 0
    return cr

@router.put("/categories/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    cat = db.exec(select(Category).where(Category.id == category_id)).first()
    if not cat:
        raise NotFoundException("Category not found")

    cat_data = data.model_dump(exclude_unset=True)
    for k, v in cat_data.items():
        setattr(cat, k, v)

    db.add(cat)
    db.commit()
    db.refresh(cat)
    cr = CategoryRead.model_validate(cat)
    return cr

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    cat = db.exec(select(Category).where(Category.id == category_id)).first()
    if not cat:
        raise NotFoundException("Category not found")
    
    # Soft delete
    cat.is_active = False
    db.add(cat)
    db.commit()
    return None

# ----------------- PRODUCTS -----------------

@router.get("/products", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_session),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_featured: Optional[bool] = None,
    in_stock_only: Optional[bool] = False,
    sort_by: Optional[str] = Query(default="newest", enum=["newest", "price_asc", "price_desc", "rating", "name"]),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=100)
):
    statement = select(Product).where(Product.is_active == True)

    if category_id:
        statement = statement.where(Product.category_id == category_id)

    if search:
        term = f"%{search.strip()}%"
        statement = statement.where(
            or_(
                Product.name.ilike(term),
                Product.description.ilike(term),
                Product.sku.ilike(term)
            )
        )

    if min_price is not None:
        statement = statement.where(Product.price >= min_price)
    if max_price is not None:
        statement = statement.where(Product.price <= max_price)

    if is_featured is not None:
        statement = statement.where(Product.is_featured == is_featured)

    if in_stock_only:
        statement = statement.where(Product.stock_quantity > 0)

    # Count total
    count_stmt = select(func.count()).select_from(statement.subquery())
    total = db.exec(count_stmt).one()

    # Sorting
    if sort_by == "price_asc":
        statement = statement.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        statement = statement.order_by(Product.price.desc())
    elif sort_by == "rating":
        statement = statement.order_by(Product.rating.desc())
    elif sort_by == "name":
        statement = statement.order_by(Product.name.asc())
    else:
        statement = statement.order_by(Product.created_at.desc())

    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)
    products = db.exec(statement).all()

    # Build response with category names
    item_reads = []
    for p in products:
        cat = db.exec(select(Category).where(Category.id == p.category_id)).first()
        pr = ProductRead.model_validate(p)
        pr.category_name = cat.name if cat else "General"
        item_reads.append(pr)

    pages = math.ceil(total / page_size) if total > 0 else 1
    return ProductListResponse(
        items=item_reads,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages
    )

@router.get("/products/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_session)):
    p = db.exec(select(Product).where(Product.id == product_id, Product.is_active == True)).first()
    if not p:
        raise NotFoundException("Product not found")

    cat = db.exec(select(Category).where(Category.id == p.category_id)).first()
    reviews = db.exec(
        select(ProductReview).where(ProductReview.product_id == p.id).order_by(ProductReview.created_at.desc())
    ).all()

    pr = ProductRead.model_validate(p)
    pr.category_name = cat.name if cat else "General"
    pr.reviews = [ReviewRead.model_validate(r) for r in reviews]
    return pr

@router.post("/products", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    existing = db.exec(select(Product).where(Product.sku == data.sku)).first()
    if existing:
        raise BadRequestException(f"Product with SKU '{data.sku}' already exists")

    slug_exists = db.exec(select(Product).where(Product.slug == data.slug)).first()
    if slug_exists:
        data.slug = f"{data.slug}-{int(math.floor(math.sin(1)*10000))}"

    prod = Product.model_validate(data)
    db.add(prod)
    db.commit()
    db.refresh(prod)

    cat = db.exec(select(Category).where(Category.id == prod.category_id)).first()
    pr = ProductRead.model_validate(prod)
    pr.category_name = cat.name if cat else "General"
    return pr

@router.put("/products/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    prod = db.exec(select(Product).where(Product.id == product_id)).first()
    if not prod:
        raise NotFoundException("Product not found")

    update_data = data.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(prod, k, v)

    db.add(prod)
    db.commit()
    db.refresh(prod)

    cat = db.exec(select(Category).where(Category.id == prod.category_id)).first()
    pr = ProductRead.model_validate(prod)
    pr.category_name = cat.name if cat else "General"
    return pr

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    prod = db.exec(select(Product).where(Product.id == product_id)).first()
    if not prod:
        raise NotFoundException("Product not found")

    prod.is_active = False
    db.add(prod)
    db.commit()
    return None

@router.post("/products/{product_id}/reviews", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def add_review(
    product_id: int,
    data: ReviewCreate,
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    prod = db.exec(select(Product).where(Product.id == product_id, Product.is_active == True)).first()
    if not prod:
        raise NotFoundException("Product not found")

    if data.rating < 1 or data.rating > 5:
        raise BadRequestException("Rating must be between 1 and 5")

    review = ProductReview(
        product_id=product_id,
        user_id=user.id,
        user_name=user.name,
        rating=data.rating,
        comment=data.comment.strip()
    )
    db.add(review)

    # Recalculate average rating
    all_reviews = db.exec(select(ProductReview).where(ProductReview.product_id == product_id)).all()
    new_count = len(all_reviews) + 1
    new_avg = (sum(r.rating for r in all_reviews) + data.rating) / new_count
    prod.rating = round(new_avg, 1)
    prod.review_count = new_count
    db.add(prod)

    db.commit()
    db.refresh(review)
    return ReviewRead.model_validate(review)
