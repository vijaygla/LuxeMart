from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.catalog import ProductRead

class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    model_name: Optional[str] = "openai.gpt-5"
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    model_used: str
    suggested_products: Optional[List[ProductRead]] = []

class AvailableModelsResponse(BaseModel):
    models: List[str]
    default_model: str
