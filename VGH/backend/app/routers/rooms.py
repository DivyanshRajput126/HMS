from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.room import Room, RoomStatus
from app.schemas.rooms import RoomCreate, RoomUpdate, RoomResponse
from app.core.permissions import require_admin, require_user

router = APIRouter()


# 🔹 Create Room (ADMIN)
@router.post("/rooms/", response_model=RoomResponse)
def create_room(
    data: RoomCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    if db.query(Room).filter(Room.room_number == data.room_number).first():
        raise HTTPException(status_code=400, detail="Room already exists")

    room = Room(room_number=data.room_number)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


# 🔹 Get All Rooms (ADMIN + MANAGER)
@router.get("/rooms", response_model=list[RoomResponse])
def get_rooms(
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    return db.query(Room).order_by(Room.room_number).all()


# 🔹 Update Room Status (ADMIN)
@router.put("/rooms/{room_id}", response_model=RoomResponse)
def update_room(
    room_id: int,
    data: RoomUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    room.status = data.status
    db.commit()
    db.refresh(room)
    return room


# 🔹 Delete Room (ADMIN)
@router.delete("/rooms/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.status == RoomStatus.OCCUPIED:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete occupied room"
        )

    db.delete(room)
    db.commit()
    return {"message": "Room deleted successfully"}
