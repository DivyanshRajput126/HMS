from pydantic import BaseModel
from enum import Enum


class RoomStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"


class RoomCreate(BaseModel):
    room_number: str


class RoomUpdate(BaseModel):
    status: RoomStatus


class RoomResponse(BaseModel):
    id: int
    room_number: str
    status: RoomStatus

    class Config:
        from_attributes = True
