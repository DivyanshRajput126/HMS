from sqlalchemy import Column, Integer, String, Date, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base
from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime, date


class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)

    guest_name = Column(String(100), nullable=False)
    guest_phone = Column(String(15))
    guest_dob = Column(Date)

    guest_document_type = Column(String(50))
    guest_document_number = Column(String(50))

    createdAt = Column(TIMESTAMP, server_default=func.now())


class GuestResponse(BaseModel):
    id: int
    customer_id : int
    guest_name: str
    guest_phone: str | None
    guest_dob: date | None
    guest_document_type: str
    guest_document_number: str

    class Config:
        from_attributes = True



class GuestListResponse(BaseModel):
    items: list[GuestResponse]
    total: int
    page: int
    pages: int