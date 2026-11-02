import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.catalog import Product
from app.schemas.order import OrderCreate, OrderRead, OrderItemRead, OrderStatusUpdate, OrderListResponse
from app.services.cart_service import CartService
from app.core.exceptions import BadRequestException, NotFoundException

router = APIRouter(prefix="/order", tags=["Orders"])

def _build_order_read(db: Session, order: Order) -> OrderRead:
    items = db.exec(select(OrderItem).where(OrderItem.order_id == order.id)).all()
    ord_read = OrderRead.model_validate(order)
    ord_read.items = [OrderItemRead.model_validate(i) for i in items]
    return ord_read

@router.post("/checkout", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def checkout(
    data: OrderCreate,
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    cart = CartService.get_cart_details(db, user.id)
    if not cart.items:
        raise BadRequestException("Your shopping cart is empty")

    # Verify inventory and compute totals
    for item in cart.items:
        prod = db.exec(select(Product).where(Product.id == item.product_id)).first()
        if not prod:
            raise BadRequestException(f"Product '{item.product_id}' no longer exists")
        if prod.stock_quantity < item.quantity:
            raise BadRequestException(f"Insufficient stock for '{prod.name}'. Only {prod.stock_quantity} available.")

    order_num = f"ORD-{uuid.uuid4().hex[:8].upper()}"

    order = Order(
        user_id=user.id,
        order_number=order_num,
        subtotal_amount=cart.subtotal,
        discount_amount=cart.discount,
        shipping_fee=cart.shipping_fee,
        tax_amount=cart.estimated_tax,
        total_amount=cart.total,
        status="Processing",
        shipping_name=data.shipping_name.strip(),
        shipping_address=data.shipping_address.strip(),
        shipping_city=data.shipping_city.strip(),
        shipping_state=data.shipping_state.strip() if data.shipping_state else "",
        shipping_postal_code=data.shipping_postal_code.strip(),
        shipping_phone=data.shipping_phone.strip(),
        payment_method=data.payment_method,
        payment_status="Paid" if data.payment_method != "COD" else "Pending"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Create order items & deduct stock
    for item in cart.items:
        prod = db.exec(select(Product).where(Product.id == item.product_id)).first()
        prod.stock_quantity -= item.quantity
        db.add(prod)

        order_item = OrderItem(
            order_id=order.id,
            product_id=prod.id,
            product_name=prod.name,
            product_image=prod.image_url,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        db.add(order_item)

    # Empty the cart
    CartService.clear_cart(db, user.id)

    db.commit()
    return _build_order_read(db, order)

@router.get("/my-orders", response_model=List[OrderRead])
def get_my_orders(
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    orders = db.exec(
        select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())
    ).all()
    return [_build_order_read(db, o) for o in orders]

@router.get("/all", response_model=List[OrderRead])
def get_all_orders_admin(
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    orders = db.exec(select(Order).order_by(Order.created_at.desc())).all()
    return [_build_order_read(db, o) for o in orders]

@router.get("/{order_id}", response_model=OrderRead)
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    statement = select(Order).where(Order.id == order_id)
    if user.role.lower() != "admin":
        statement = statement.where(Order.user_id == user.id)

    order = db.exec(statement).first()
    if not order:
        raise NotFoundException("Order not found")

    return _build_order_read(db, order)

@router.put("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    order = db.exec(select(Order).where(Order.id == order_id)).first()
    if not order:
        raise NotFoundException("Order not found")

    order.status = data.status
    if data.payment_status:
        order.payment_status = data.payment_status

    db.add(order)
    db.commit()
    db.refresh(order)
    return _build_order_read(db, order)
