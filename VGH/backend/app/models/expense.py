from sqlalchemy import Column, Integer, String, Text, Date, Time, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    expense_type = Column(String(100), nullable=False)
    expense_details = Column(Text, nullable=True)
    expense_amount = Column(DECIMAL(10, 2), nullable=False)

    expense_date = Column(Date, nullable=False)
    expense_time = Column(Time, nullable=False)

    createdAt = Column(TIMESTAMP, server_default=func.now())
    updatedAt = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
