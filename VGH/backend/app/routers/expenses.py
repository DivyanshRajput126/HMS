from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.expense import Expense
from app.schemas.expenses import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.core.permissions import require_user, require_admin

router = APIRouter()


# 🔹 Add Expense (Admin + Manager)
@router.post("/", response_model=ExpenseResponse)
def add_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    expense = Expense(**data.dict())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


from sqlalchemy import extract

# 🔹 View Expenses (Admin + Manager)
@router.get("/", response_model=list[ExpenseResponse])
def list_expenses(
    month: int | None = None,
    year: int | None = None,
    db: Session = Depends(get_db),
    _: dict = Depends(require_user)
):
    query = db.query(Expense)
    
    if year:
        query = query.filter(extract("year", Expense.expense_date) == year)
    if month:
        query = query.filter(extract("month", Expense.expense_date) == month)

    return query.order_by(Expense.expense_date.desc()).all()


# 🔹 Update Expense (Admin Only)
@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    data: ExpenseUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)
    return expense


# 🔹 Delete Expense (Admin Only)
@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}
