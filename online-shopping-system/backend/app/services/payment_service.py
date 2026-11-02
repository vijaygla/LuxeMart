import uuid
import json
from datetime import datetime, timezone
from sqlmodel import Session, select
from app.models.payment import PaymentTransaction
from app.models.order import Order
from app.schemas.payment import PaymentProcessRequest, PaymentResponse

class PaymentService:
    @staticmethod
    def process_payment(db: Session, user_id: int, request: PaymentProcessRequest) -> PaymentResponse:
        order = db.exec(
            select(Order).where(Order.id == request.order_id, Order.user_id == user_id)
        ).first()
        if not order:
            raise ValueError("Order not found")

        tx_ref = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        
        # Payment Gateway simulation
        gateway_data = {
            "gateway": "LuxeMart Gateway",
            "method": request.payment_method,
            "auth_code": uuid.uuid4().hex[:8].upper(),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        payment_tx = PaymentTransaction(
            order_id=order.id,
            user_id=user_id,
            transaction_reference=tx_ref,
            amount=order.total_amount,
            payment_method=request.payment_method,
            status="Success",
            gateway_response_json=json.dumps(gateway_data)
        )
        db.add(payment_tx)

        # Update order status
        order.payment_status = "Paid"
        order.status = "Processing"
        db.add(order)
        db.commit()
        db.refresh(payment_tx)

        return PaymentResponse(
            success=True,
            transaction_reference=tx_ref,
            order_id=order.id,
            amount=order.total_amount,
            status="Success",
            message="Payment processed successfully",
            created_at=payment_tx.created_at
        )
