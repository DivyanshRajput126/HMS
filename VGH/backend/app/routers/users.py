from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.users import UserCreate, UserResponse
from app.models.users import User
from app.core.security import hash_password
from app.core.permissions import require_admin

router = APIRouter()


@router.post("/", response_model=UserResponse)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(detail="Username already exists", status_code=400)

    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        email=data.email,
        phone=data.phone,
        role=data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
