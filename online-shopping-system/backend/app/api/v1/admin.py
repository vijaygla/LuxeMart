from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.db.session import get_session
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.catalog import Product, Category
from app.models.order import Order, OrderItem
from app.schemas.admin import DashboardStatsRead, CategorySales
from app.schemas.catalog import ProductRead
from app.schemas.order import OrderRead, OrderItemRead

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=DashboardStatsRead)
def get_dashboard_stats(
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    total_revenue = db.exec(
        select(func.sum(Order.total_amount)).where(Order.payment_status == "Paid")
    ).one() or 0.0

    total_orders = db.exec(select(func.count(Order.id))).one() or 0
    total_products = db.exec(select(func.count(Product.id)).where(Product.is_active == True)).one() or 0
    total_users = db.exec(select(func.count(User.id))).one() or 0

    pending_orders = db.exec(
        select(func.count(Order.id)).where(Order.status.in_(["Pending", "Processing"]))
    ).one() or 0

    # Low stock items (stock <= 10)
    low_stock_prods = db.exec(
        select(Product).where(Product.stock_quantity <= 10, Product.is_active == True)
    ).all()
    low_stock_reads = [ProductRead.model_validate(p) for p in low_stock_prods]

    # Recent 5 orders
    recent = db.exec(select(Order).order_by(Order.created_at.desc()).limit(5)).all()
    recent_reads = []
    for o in recent:
        items = db.exec(select(OrderItem).where(OrderItem.order_id == o.id)).all()
        ord_read = OrderRead.model_validate(o)
        ord_read.items = [OrderItemRead.model_validate(i) for i in items]
        recent_reads.append(ord_read)

    # Category breakdown
    categories = db.exec(select(Category).where(Category.is_active == True)).all()
    cat_sales: List[CategorySales] = []
    for c in categories:
        prods = db.exec(select(Product).where(Product.category_id == c.id, Product.is_active == True)).all()
        prod_ids = [p.id for p in prods]
        
        sales_val = 0.0
        if prod_ids:
            sales_val = db.exec(
                select(func.sum(OrderItem.total_price)).where(OrderItem.product_id.in_(prod_ids))
            ).one() or 0.0

        cat_sales.append(CategorySales(
            category_name=c.name,
            product_count=len(prods),
            total_sales=round(float(sales_val), 2)
        ))

    return DashboardStatsRead(
        total_revenue=round(float(total_revenue), 2),
        total_orders=total_orders,
        total_products=total_products,
        total_users=total_users,
        pending_orders=pending_orders,
        low_stock_count=len(low_stock_prods),
        low_stock_products=low_stock_reads,
        recent_orders=recent_reads,
        category_sales=cat_sales
    )
