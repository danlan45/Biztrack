
from pydantic import BaseModel

# Product
class ProductBase(BaseModel):
    name: str
    price: float
    quantity: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True


# Sale
class SaleBase(BaseModel):
    product_id: int
    quantity_sold: int

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    amount: float

    class Config:
        from_attributes = True


# Expense
class ExpenseBase(BaseModel):
    description: str
    amount: float

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int

    class Config:
        from_attributes = True
