from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..auth import get_current_user, get_optional_current_user
from ..database.database import get_db
from ..database.models import Employee

router = APIRouter(prefix="/employees", tags=["employees"])


class EmployeeBase(BaseModel):
    name: str = Field(..., example="John Doe")
    email: str = Field(..., example="john.doe@example.com")
    role: str = Field("employee", example="manager")
    active: bool = Field(True, example=True)

    model_config = {
        "from_attributes": True
    }


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    id: int


@router.get("/", response_model=list[EmployeeRead])
def list_employees(db: Session = Depends(get_db)):
    return db.query(Employee).order_by(Employee.id).all()


@router.post("/", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: Employee | None = Depends(get_optional_current_user),
):
    existing = db.query(Employee).filter(Employee.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    admin_exists = db.query(Employee).filter(Employee.role == "admin").first()
    if admin_exists:
        if not current_user or current_user.role != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    else:
        if payload.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The first account created must be an admin",
            )

    employee = Employee(
        name=payload.name,
        email=payload.email,
        role=payload.role,
        active=payload.active,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.get("/me", response_model=EmployeeRead)
def read_current_user(current_user: Employee = Depends(get_current_user)):
    return current_user


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: int, payload: EmployeeCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    for field, value in payload.model_dump().items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    db.delete(employee)
    db.commit()
    return None
