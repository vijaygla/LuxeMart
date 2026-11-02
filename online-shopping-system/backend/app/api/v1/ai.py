from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.session import get_session
from app.api.deps import get_optional_user
from app.models.user import User
from app.schemas.ai import ChatRequest, ChatResponse, AvailableModelsResponse
from app.ai.client import ai_client
from app.core.config import settings

router = APIRouter(prefix="/ai", tags=["AI Shopping Assistant"])

@router.get("/models", response_model=AvailableModelsResponse)
def get_available_models():
    return AvailableModelsResponse(
        models=settings.ALLOWED_AI_MODELS,
        default_model=settings.DEFAULT_AI_MODEL
    )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_session),
    user: User = Depends(get_optional_user)
):
    user_id = user.id if user else None
    return await ai_client.chat(
        message=request.message,
        db=db,
        model_name=request.model_name,
        history=request.history,
        user_id=user_id
    )
