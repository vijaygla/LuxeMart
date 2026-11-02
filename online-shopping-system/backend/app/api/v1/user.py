from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserRead, Token, UserUpdateRole
from app.core.security import verify_password, hash_password, create_access_token
from app.core.exceptions import BadRequestException, UnauthorizedException, NotFoundException
from app.api.deps import get_current_user, get_current_admin

router = APIRouter(prefix="/user", tags=["User & Auth"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_session)):
    existing = db.exec(select(User).where(User.email == data.email.lower())).first()
    if existing:
        raise BadRequestException("An account with this email already exists")

    # All registered users are strictly created with Customer role
    user = User(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        hashed_password=hash_password(data.password),
        role="Customer",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role=user.role)
    return Token(access_token=token, token_type="bearer", user=UserRead.model_validate(user))

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_session)):
    user = db.exec(select(User).where(User.email == data.email.lower().strip())).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise UnauthorizedException("Invalid email or password")
    
    if not user.is_active:
        raise UnauthorizedException("Account has been deactivated")

    token = create_access_token(subject=user.id, role=user.role)
    return Token(access_token=token, token_type="bearer", user=UserRead.model_validate(user))

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return UserRead.model_validate(current_user)

@router.get("/users", response_model=List[UserRead])
def list_users(
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    users = db.exec(select(User).order_by(User.id.desc())).all()
    return [UserRead.model_validate(u) for u in users]

@router.put("/users/{user_id}/role", response_model=UserRead)
def update_user_role(
    user_id: int,
    data: UserUpdateRole,
    db: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    user = db.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise NotFoundException("User not found")

    if data.role not in ["Admin", "Customer"]:
        raise BadRequestException("Invalid role")

    user.role = data.role
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)
