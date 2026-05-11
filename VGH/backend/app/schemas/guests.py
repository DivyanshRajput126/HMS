from pydantic import BaseModel
from datetime import date


class GuestCreate(BaseModel):
    customer_id : int
    guest_name: str
    guest_phone: str | None
    guest_dob: date | None
    guest_document_type: str
    guest_document_number: str


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
