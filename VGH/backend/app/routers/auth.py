from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.users import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import verify_password, create_access_token, hash_password

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    # ... (your existing validation logic) ...
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # ✅ Password verification
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    token = create_access_token({
        "sub": user.username, # It's standard practice to use 'sub' for the identifier
        "role": user.role.value
    })

    # You MUST include the role here so the frontend can see it!
    return {
        "access_token": token, 
        "token_type": "bearer",
        "role": user.role.value  # <--- Add this
    }