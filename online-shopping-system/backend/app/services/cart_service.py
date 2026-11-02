from typing import List, Optional
from datetime import datetime, timezone
from sqlmodel import Session, select
from app.models.cart import Cart, CartItem
from app.models.catalog import Product
from app.schemas.cart import CartRead, CartItemRead
from app.schemas.catalog import ProductRead

class CartService:
    @staticmethod
    def get_or_create_cart(db: Session, user_id: int) -> Cart:
        cart = db.exec(select(Cart).where(Cart.user_id == user_id)).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    @staticmethod
    def get_cart_details(db: Session, user_id: int) -> CartRead:
        cart = CartService.get_or_create_cart(db, user_id)
        items = db.exec(select(CartItem).where(CartItem.cart_id == cart.id)).all()
        
        item_reads: List[CartItemRead] = []
        subtotal = 0.0
        total_items = 0

        for item in items:
            product = db.exec(select(Product).where(Product.id == item.product_id)).first()
            if not product or not product.is_active:
                continue

            current_price = product.discount_price if product.discount_price else product.price
            item_total = round(current_price * item.quantity, 2)
            subtotal += item_total
            total_items += item.quantity

            prod_read = ProductRead.model_validate(product)
            item_reads.append(CartItemRead(
                id=item.id,
                cart_id=cart.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=current_price,
                total_price=item_total,
                product=prod_read
            ))

        subtotal = round(subtotal, 2)
        shipping_fee = 0.0 if (subtotal >= 100 or subtotal == 0) else 15.0
        discount = round(subtotal * 0.05, 2) if subtotal > 200 else 0.0
        tax = round((subtotal - discount) * 0.08, 2) if subtotal > 0 else 0.0
        total = round(subtotal - discount + shipping_fee + tax, 2)

        return CartRead(
            id=cart.id,
            user_id=user_id,
            items=item_reads,
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            discount=discount,
            estimated_tax=tax,
            total=total,
            item_count=total_items
        )

    @staticmethod
    def add_to_cart(db: Session, user_id: int, product_id: int, quantity: int = 1) -> CartRead:
        cart = CartService.get_or_create_cart(db, user_id)
        product = db.exec(select(Product).where(Product.id == product_id)).first()
        if not product or not product.is_active:
            raise ValueError("Product not available")

        cart_item = db.exec(
            select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
        ).first()

        current_price = product.discount_price if product.discount_price else product.price

        if cart_item:
            cart_item.quantity += quantity
            cart_item.unit_price = current_price
            db.add(cart_item)
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity,
                unit_price=current_price
            )
            db.add(cart_item)

        cart.updated_at = datetime.now(timezone.utc)
        db.add(cart)
        db.commit()
        return CartService.get_cart_details(db, user_id)

    @staticmethod
    def update_cart_item(db: Session, user_id: int, item_id: int, quantity: int) -> CartRead:
        cart = CartService.get_or_create_cart(db, user_id)
        cart_item = db.exec(
            select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
        ).first()
        if not cart_item:
            raise ValueError("Item not in cart")

        if quantity <= 0:
            db.delete(cart_item)
        else:
            cart_item.quantity = quantity
            db.add(cart_item)

        cart.updated_at = datetime.now(timezone.utc)
        db.add(cart)
        db.commit()
        return CartService.get_cart_details(db, user_id)

    @staticmethod
    def remove_cart_item(db: Session, user_id: int, item_id: int) -> CartRead:
        cart = CartService.get_or_create_cart(db, user_id)
        cart_item = db.exec(
            select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
        ).first()
        if cart_item:
            db.delete(cart_item)
            cart.updated_at = datetime.now(timezone.utc)
            db.add(cart)
            db.commit()
        return CartService.get_cart_details(db, user_id)

    @staticmethod
    def clear_cart(db: Session, user_id: int):
        cart = CartService.get_or_create_cart(db, user_id)
        items = db.exec(select(CartItem).where(CartItem.cart_id == cart.id)).all()
        for item in items:
            db.delete(item)
        cart.updated_at = datetime.now(timezone.utc)
        db.add(cart)
        db.commit()
