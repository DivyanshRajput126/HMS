from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from enum import Enum


class Sex(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


class CustomerCreate(BaseModel):
    full_name: str
    full_address: str | None
    email: EmailStr | None
    phone: str
    coming_from: str | None
    going_to: str | None
    company_name: str | None
    dob: date | None
    sex: Sex | None
    vehicle_no: str | None
    no_of_person: int
    document_type: str
    document_number: str
    document_storage_address: str
    room_id: int
    checkin_datetime: datetime
    amount_collected: int | None
    payment_mode: str
    registrar_no: str


class CustomerCheckout(BaseModel):
    checkout_datetime: datetime
    amount_charged: float
    amount_collected: float


class CustomerUpdate(BaseModel):
    full_name: str | None = None
    full_address: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    coming_from: str | None = None
    going_to: str | None = None
    company_name: str | None = None
    dob: date | None = None
    sex: Sex | None = None
    vehicle_no: str | None = None
    no_of_person: int | None = None
    document_type: str | None = None
    document_number: str | None = None


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    phone: str
    room_id: int
    no_of_person: int
    checkin_datetime: datetime
    checkout_datetime: datetime | None
    amount_charged: float | None
    amount_collected: float | None
    pending_amount: float | None
    registrar_no: str

    class Config:
        from_attributes = True
