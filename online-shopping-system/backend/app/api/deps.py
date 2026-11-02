from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from app.db.session import get_session
from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models.user import User

security = HTTPBearer(auto_error=False)

def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_session)
) -> User:
    if not auth or not auth.credentials:
        raise UnauthorizedException("Authentication token required")
    
    payload = decode_access_token(auth.credentials)
    if not payload:
        raise UnauthorizedException("Invalid or expired token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload")
    
    user = db.exec(select(User).where(User.id == int(user_id))).first()
    if not user or not user.is_active:
        raise UnauthorizedException("User not found or inactive")
    
    return user

def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role.lower() != "admin":
        raise ForbiddenException("Admin privileges required for this operation")
    return current_user

def get_optional_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_session)
) -> Optional[User]:
    if not auth or not auth.credentials:
        return None
    
    payload = decode_access_token(auth.credentials)
    if not payload:
        return None
    
    user_id = payload.get("sub")
    if not user_id:
        return None
    
    try:
        user = db.exec(select(User).where(User.id == int(user_id))).first()
        return user if user and user.is_active else None
    except Exception:
        return None
