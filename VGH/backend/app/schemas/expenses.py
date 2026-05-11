from pydantic import BaseModel
from datetime import date, time


class ExpenseCreate(BaseModel):
    expense_type: str
    expense_details: str | None
    expense_amount: float
    expense_date: date
    expense_time: time


class ExpenseUpdate(BaseModel):
    expense_type: str | None
    expense_details: str | None
    expense_amount: float | None
    expense_date: date | None
    expense_time: time | None


class ExpenseResponse(BaseModel):
    id: int
    expense_type: str
    expense_details: str | None
    expense_amount: float
    expense_date: date
    expense_time: time

    class Config:
        from_attributes = True
