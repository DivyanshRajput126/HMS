from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import datetime
from app.core.database import get_db
from app.models.customer import Customer
from app.models.expense import Expense
from app.core.permissions import require_admin, require_user
from sqlalchemy import func, extract
from datetime import datetime, date
from app.models.room import Room
from app.models.customer import Customer
from app.models.expense import Expense

router = APIRouter(tags=["Reports"])


@router.get("/monthly-profit")
def monthly_profit_report(
    year: int = Query(datetime.now().year),
    month: int = Query(datetime.now().month),
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    # ✅ total income from customers
    income = db.query(
        func.coalesce(func.sum(Customer.amount_collected), 0)
    ).filter(
        extract("year", Customer.checkin_datetime) == year,
        extract("month", Customer.checkin_datetime) == month
    ).scalar()

    # ✅ total expenses
    expense = db.query(
        func.coalesce(func.sum(Expense.expense_amount), 0)
    ).filter(
        extract("year", Expense.expense_date) == year,
        extract("month", Expense.expense_date) == month
    ).scalar()

    profit = income - expense

    # ✅ get actual customer records for income sources
    customers = db.query(Customer).filter(
        extract("year", Customer.checkin_datetime) == year,
        extract("month", Customer.checkin_datetime) == month
    ).all()

    income_sources = [
        {
            "id": c.id,
            "full_name": c.full_name,
            "payment_mode": c.payment_mode,
            "amount_collected": float(c.amount_collected) if c.amount_collected else 0,
            "checkin_datetime": c.checkin_datetime.isoformat() if c.checkin_datetime else None
        } for c in customers if c.amount_collected and c.amount_collected > 0
    ]

    # ✅ get actual expense records for expense sources
    expenses = db.query(Expense).filter(
        extract("year", Expense.expense_date) == year,
        extract("month", Expense.expense_date) == month
    ).all()

    expense_sources = [
        {
            "id": e.id,
            "expense_type": e.expense_type,
            "expense_details": e.expense_details,
            "expense_amount": float(e.expense_amount),
            "expense_date": e.expense_date.isoformat() if e.expense_date else None
        } for e in expenses
    ]

    return {
        "year": year,
        "month": month,
        "total_income": float(income),
        "total_expense": float(expense),
        "net": float(profit),
        "status": "profit" if profit >= 0 else "loss",
        "income_sources": income_sources,
        "expense_sources": expense_sources
    }



@router.get("/dashboard")
def dashboard_data(
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    today = date.today()
    now = datetime.now()

    # -------------------------
    # Rooms
    # -------------------------
    total_rooms = db.query(func.count(Room.id)).scalar()

    occupied_rooms = db.query(func.count(Room.id)).filter(
        Room.status == "OCCUPIED"
    ).scalar()

    available_rooms = total_rooms - occupied_rooms

    # -------------------------
    # Today activity
    # -------------------------
    today_checkins = db.query(func.count(Customer.id)).filter(
        func.date(Customer.checkin_datetime) == today
    ).scalar()

    today_checkouts = db.query(func.count(Customer.id)).filter(
        func.date(Customer.checkout_datetime) == today
    ).scalar()

    # -------------------------
    # Monthly finance
    # -------------------------
    income = db.query(
        func.coalesce(func.sum(Customer.amount_charged), 0)
    ).filter(
        extract("year", Customer.checkin_datetime) == now.year,
        extract("month", Customer.checkin_datetime) == now.month
    ).scalar()

    expense = db.query(
        func.coalesce(func.sum(Expense.expense_amount), 0)
    ).filter(
        extract("year", Expense.expense_date) == now.year,
        extract("month", Expense.expense_date) == now.month
    ).scalar()

    return {
        "rooms": {
            "total": total_rooms,
            "available": available_rooms,
            "occupied": occupied_rooms,
        },
        "today": {
            "checkins": today_checkins,
            "checkouts": today_checkouts,
        },
        "finance": {
            "income": float(income),
            "expense": float(expense),
            "net": float(income - expense),
        },
    }
