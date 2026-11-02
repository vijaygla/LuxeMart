from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class PaymentProcessRequest(BaseModel):
    order_id: int
    payment_method: str
    card_number: Optional[str] = None
    card_holder: Optional[str] = None
    expiry: Optional[str] = None
    cvv: Optional[str] = None
    upi_id: Optional[str] = None

class PaymentResponse(BaseModel):
    success: bool
    transaction_reference: str
    order_id: int
    amount: float
    status: str
    message: str
    created_at: datetime
