from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.db.session import get_session
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.cart import CartRead, CartItemAdd, CartItemUpdate
from app.services.cart_service import CartService
from app.core.exceptions import BadRequestException

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])

@router.get("", response_model=CartRead)
def get_cart(
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    return CartService.get_cart_details(db, user.id)

@router.post("/items", response_model=CartRead, status_code=status.HTTP_201_CREATED)
def add_item_to_cart(
    data: CartItemAdd,
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    try:
        return CartService.add_to_cart(db, user.id, data.product_id, data.quantity)
    except ValueError as e:
        raise BadRequestException(str(e))

@router.put("/items/{item_id}", response_model=CartRead)
def update_item_quantity(
    item_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    try:
        return CartService.update_cart_item(db, user.id, item_id, data.quantity)
    except ValueError as e:
        raise BadRequestException(str(e))

@router.delete("/items/{item_id}", response_model=CartRead)
def remove_item(
    item_id: int,
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    return CartService.remove_cart_item(db, user.id, item_id)

@router.delete("/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    CartService.clear_cart(db, user.id)
    return None
