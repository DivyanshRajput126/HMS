from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class RoomStatus(enum.Enum):
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(10), unique=True, nullable=False)
    status = Column(Enum(RoomStatus), default=RoomStatus.AVAILABLE)
    createdAt = Column(TIMESTAMP, server_default=func.now())
    updatedAt = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
