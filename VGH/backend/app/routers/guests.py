from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.guest import Guest
from app.models.customer import Customer
from app.schemas.guests import GuestCreate, GuestResponse
from app.core.permissions import require_user
from app.models.guest import GuestListResponse

router = APIRouter(tags=["Guests"])


@router.get("/list", response_model=GuestListResponse)
def list_guests(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, le=100),
    q: str | None = None,

    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    query = db.query(Guest)

    # ✅ Global search
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Guest.guest_name.ilike(like),
                Guest.guest_phone.ilike(like),
                Guest.guest_document_number.ilike(like),
                Guest.guest_document_type.ilike(like),
            )
        )

    total = query.count()

    rows = (
        query
        .order_by(Guest.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": rows,
        "total": total,
        "page": page,
        "pages": (total + page_size - 1) // page_size
    }

# ✅ Add Guest
@router.post("/", response_model=GuestResponse)
def add_guest(
    data: GuestCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    # verify customer exists
    customer = db.query(Customer).filter(
        Customer.id == data.customer_id
    ).first()

    if not customer:
        raise HTTPException(404, "Customer not found")

    guest = Guest(**data.dict())

    db.add(guest)
    db.commit()
    db.refresh(guest)

    return guest


# ✅ List Guests by customer
@router.get("/by-customer/{customer_id}", response_model=list[GuestResponse])
def list_guests(
    customer_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    return db.query(Guest).filter(
        Guest.customer_id == customer_id
    ).all()


# ✅ Delete Guest (optional but useful)
@router.delete("/{guest_id}")
def delete_guest(
    guest_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    g = db.query(Guest).filter(Guest.id == guest_id).first()

    if not g:
        raise HTTPException(404, "Guest not found")

    db.delete(g)
    db.commit()

    return {"message": "Guest removed"}
