from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app.core.database import get_db
from app.models.customer import Customer
from app.models.room import Room, RoomStatus
from app.schemas.customers import (
    CustomerCreate, CustomerCheckout, CustomerResponse, CustomerUpdate
)
from app.models.customer import CustomerListResponse
from app.core.permissions import require_user
from datetime import datetime
from decimal import Decimal
import os
import logging

logger = logging.getLogger(__name__)

from app.models.guest import Guest

router = APIRouter()

@router.get("/list", response_model=CustomerListResponse) # Fix: Changed from dict
def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, le=100),
    q: str | None = None,
    pending_only: bool = Query(False),
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    query = db.query(Customer)

    if pending_only:
        query = query.filter(Customer.pending_amount > 0)

    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Customer.full_name.ilike(like),
                Customer.phone.ilike(like),
                Customer.email.ilike(like),
                Customer.document_number.ilike(like),
                Customer.vehicle_no.ilike(like),
                Customer.full_address.ilike(like),
                Customer.company_name.ilike(like),
                Customer.coming_from.ilike(like),
                Customer.going_to.ilike(like),
            )
        )

    total = query.count()
    rows = (
        query.order_by(Customer.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    # Now this return will be correctly serialized by CustomerListResponse
    return {
        "items": rows,
        "total": total,
        "page": page,
        "pages": (total + page_size - 1) // page_size
    }

# 🔹 CHECK-IN
@router.post("/checkin", response_model=CustomerResponse)
def checkin_customer(
    room_id: int = Form(...),
    full_name: str = Form(...),
    phone: str = Form(...),
    
    # --- UPDATED TO MATCH FRONTEND NAMES ---
    amount_charged: float = Form(...),        # From UI: "Daily Room Rate"
    amount_collected: float = Form(...),  # From UI: "Amount Collected"
    payment_mode: str = Form(...),
    checkin_datetime: str = Form(None), 
    registrar_no: str = Form(...),

    full_address: str = Form(None),
    email: str = Form(None),
    coming_from: str = Form(None),
    going_to: str = Form(None),
    company_name: str = Form(None),
    dob: str = Form(None),                # Date as string from UI
    sex: str = Form("MALE"),
    vehicle_no: str = Form(None),
    no_of_person: int = Form(1),
    document_type: str = Form(None),
    document_number: str = Form(None),

    document_file: UploadFile = File(None),

    db: Session = Depends(get_db),
    _: dict = Depends(require_user),
):
    # 1. Verify Room
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(404, "Room not found")

    # 2. Handle Date Parsing for Check-in
    parsed_checkin = datetime.now()
    if checkin_datetime:
        try:
            parsed_checkin = datetime.fromisoformat(checkin_datetime)
        except ValueError:
            pass

    # 3. Handle File Storage
    file_path = None
    if document_file:
        today = datetime.now().strftime("%Y-%m-%d")
        safe_name = full_name.replace(" ", "_")
        folder = f"uploads/customers/{safe_name}_{today}"
        os.makedirs(folder, exist_ok=True)
        
        file_path = f"{folder}/{document_file.filename}"
        with open(file_path, "wb") as f:
            f.write(document_file.file.read())

    # 4. Create Customer Instance based on your Modal
    customer = Customer(
        room_id=room_id,
        full_name=full_name,
        full_address=full_address,
        email=email,
        phone=phone,
        coming_from=coming_from,
        going_to=going_to,
        company_name=company_name,
        dob=datetime.strptime(dob, "%Y-%m-%d").date() if dob else None, # Convert str to Date
        sex=sex,
        vehicle_no=vehicle_no,
        no_of_person=no_of_person,
        document_type=document_type,
        document_number=document_number,
        document_storage_address=file_path,
        payment_mode=payment_mode,
        
        # --- MAPPING UI TO MODAL COLUMNS ---
        amount_charged=amount_charged,      # Storing daily rate in amount_charged
        amount_collected=amount_collected, # Storing initial payment
        checkin_datetime=parsed_checkin ,
        registrar_no= registrar_no 
    )

    db.add(customer)

    # 5. Mark room as occupied
    room.status = RoomStatus.OCCUPIED

    db.commit()
    db.refresh(customer)

    return customer

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer_by_id(
    customer_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(404, "Customer not found")

    return customer

@router.get("/active/{room_id}", response_model=CustomerResponse)
def get_active_customer_by_room(
    room_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    """
    Fetch latest active customer for a room
    Active = checkout_datetime is NULL
    """

    customer = (
        db.query(Customer)
        .filter(Customer.room_id == room_id)
        .filter(Customer.checkout_datetime == None)
        .order_by(desc(Customer.checkin_datetime))
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="No active customer for this room"
        )

    return customer


# 🔹 CHECK-OUT
@router.post("/checkout/by-room/{room_id}")
def checkout_by_room(
    room_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    # 1. Find active customer
    customer = (
        db.query(Customer)
        .filter(Customer.room_id == room_id)
        .filter(Customer.checkout_datetime == None)
        .order_by(desc(Customer.checkin_datetime))
        .first()
    )

    if not customer:
        raise HTTPException(404, "No active customer found for this room")

    # 2. Handle Checkout Time
    checkout_val = payload.get("checkout_datetime")
    if checkout_val:
        try:
            customer.checkout_datetime = datetime.fromisoformat(checkout_val)
        except ValueError:
            customer.checkout_datetime = datetime.now()
    else:
        customer.checkout_datetime = datetime.now()

    # 3. SETTLE BALANCE: 
    # Read the explicit split from the frontend payload
    paid_now = payload.get("paid_now", 0)
    pending_remainder = payload.get("pending_remainder", 0)
    
    try:
        # Convert to Decimal to avoid floating point errors
        paid_decimal = Decimal(str(paid_now))
        pending_decimal = Decimal(str(pending_remainder))
        
        if paid_decimal != 0:
            if customer.amount_collected is None:
                customer.amount_collected = Decimal("0.00")
            customer.amount_collected += paid_decimal

        if pending_decimal != 0:
            if customer.pending_amount is None:
                customer.pending_amount = Decimal("0.00")
            customer.pending_amount += pending_decimal
    except Exception as e:
        raise HTTPException(400, "Invalid settlement amount format")

    # 4. Free the room
    room = db.query(Room).get(room_id)
    if room:
        room.status = RoomStatus.AVAILABLE

    db.commit()
    db.refresh(customer)

    return {
        "message": "Checkout completed and balance settled",
        "customer_id": customer.id,
        "final_total_collected": float(customer.amount_collected),
        "checkout_at": customer.checkout_datetime
    }

# 🔹 LIST CUSTOMERS
@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    return db.query(Customer).order_by(Customer.checkin_datetime.desc()).all()


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    payload: CustomerUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    customer = db.query(Customer).get(customer_id)
    if not customer:
        raise HTTPException(404, "Customer not found")

    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(customer, key, value)

    db.commit()
    db.refresh(customer)
    return customer


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    customer = db.query(Customer).get(customer_id)
    if not customer:
        raise HTTPException(404, "Customer not found")

    # If active room, free the room
    if customer.checkout_datetime is None and customer.room_id:
        room = db.query(Room).get(customer.room_id)
        if room:
            room.status = RoomStatus.AVAILABLE

    # Delete associated guests first
    db.query(Guest).filter(Guest.customer_id == customer_id).delete()

    db.delete(customer)
    db.commit()
    return {"message": "Customer and associated guests deleted successfully"}


@router.patch("/collect-money/{customer_id}")
def collect_money_api(
    customer_id: int,
    amount_collected: float = Form(...), # Matches the frontend formData.append("amount_collected", ...)
    db: Session = Depends(get_db),
    _: dict = Depends(require_user),
):
    # DEBUG console print
    print(f"--- Collecting money for Customer ID: {customer_id} ---")

    # 1. Fetch the customer using .get() (efficient lookup by PK)
    customer = db.query(Customer).get(customer_id)

    # 2. Validation
    if not customer:
        logger.error(f"Customer with ID {customer_id} not found.")
        raise HTTPException(
            status_code=404, 
            detail=f"Customer ID {customer_id} not found. Check Guest ID vs Room ID."
        )

    # 3. Logic: Increment the amount_collected and decrement pending_amount
    try:
        # Use Decimal for financial precision
        payment_decimal = Decimal(str(amount_collected))
        
        # Initialize to 0 if the field is currently NULL in DB
        if customer.amount_collected is None:
            customer.amount_collected = Decimal("0.00")
            
        customer.amount_collected += payment_decimal

        if customer.pending_amount is not None:
            customer.pending_amount -= payment_decimal
            if customer.pending_amount < 0:
                customer.pending_amount = Decimal("0.00")
        
    except Exception as e:
        logger.error(f"Formatting error: {e}")
        raise HTTPException(status_code=400, detail="Invalid amount format")

    # 4. Save to Database
    db.commit()
    db.refresh(customer)

    # 5. Return updated values
    return {
        "message": "Payment recorded successfully",
        "customer_id": customer.id,
        "new_total_collected": float(customer.amount_collected),
        "collected_now": amount_collected  # Fixed variable name here
    }