from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class PaymentTransaction(SQLModel, table=True):
    __tablename__ = "payment_transactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    transaction_reference: str = Field(unique=True, index=True, max_length=150)
    amount: float = Field(default=0.0)
    payment_method: str = Field(max_length=50)
    status: str = Field(default="Success", max_length=50)  # Success, Failed, Pending
    gateway_response_json: Optional[str] = Field(default="{}", max_length=4000)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
