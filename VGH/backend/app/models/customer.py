from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime,
    DECIMAL, Enum, ForeignKey, TIMESTAMP
)
from sqlalchemy.sql import func
from app.core.database import Base
import enum
from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime, date

class Sex(enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    full_address = Column(Text)
    email = Column(String(100))
    phone = Column(String(15))
    coming_from = Column(String(100))
    going_to = Column(String(100))
    company_name = Column(String(100))
    dob = Column(Date)
    sex = Column(Enum(Sex))
    vehicle_no = Column(String(30))
    no_of_person = Column(Integer)

    document_type = Column(String(50))
    document_number = Column(String(50))
    document_storage_address = Column(Text)

    checkin_datetime = Column(DateTime, nullable=False)
    checkout_datetime = Column(DateTime, nullable=True)

    amount_charged = Column(DECIMAL(10, 2))
    room_id = Column(Integer, ForeignKey("rooms.id"))

    createdAt = Column(TIMESTAMP, server_default=func.now())
    updatedAt = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    amount_collected = Column(DECIMAL(10, 2))
    pending_amount = Column(DECIMAL(10, 2), nullable=True)

    payment_mode = Column(String(50))

    registrar_no = Column(String(50), nullable=False)

class CustomerResponse(BaseModel):
    id: int
    full_name: str
    full_address: str | None
    email: str | None
    phone: str | None
    coming_from: str | None
    going_to: str | None
    company_name: str | None
    dob: date | None
    sex: str | None # Using str here handles the Enum conversion automatically
    vehicle_no: str | None
    no_of_person: int
    document_type: str | None
    document_number: str | None
    document_storage_address: str | None
    checkin_datetime: datetime
    checkout_datetime: datetime | None
    amount_charged: float | None
    room_id: int
    createdAt: datetime
    updatedAt: datetime
    amount_collected: float | None
    pending_amount: float | None
    payment_mode: str
    registrar_no: str
    # The magic line for SQLAlchemy objects:
    model_config = ConfigDict(from_attributes=True)

# Define the pagination wrapper
class CustomerListResponse(BaseModel):
    items: list[CustomerResponse]
    total: int
    page: int
    pages: int