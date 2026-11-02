from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.db.session import get_session
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.payment import PaymentProcessRequest, PaymentResponse
from app.services.payment_service import PaymentService
from app.core.exceptions import BadRequestException

router = APIRouter(prefix="/payment", tags=["Payments"])

@router.post("/process", response_model=PaymentResponse, status_code=status.HTTP_200_OK)
def process_payment(
    request: PaymentProcessRequest,
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    try:
        return PaymentService.process_payment(db, user.id, request)
    except ValueError as e:
        raise BadRequestException(str(e))
