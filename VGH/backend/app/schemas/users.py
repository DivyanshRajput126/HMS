from pydantic import BaseModel, EmailStr
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    phone: str | None = None
    role: UserRole


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone: str | None
    role: UserRole
    isActive: bool

    class Config:
        from_attributes = True
