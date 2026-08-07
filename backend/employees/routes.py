from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..auth.dependencies import get_current_user, require_admin
from ..core.security import hash_password
from ..database.database import get_db
from ..database.models import Employee
from .schemas import EmployeeCreate, EmployeeRead, EmployeeUpdate

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeRead])
def list_employees(
    search: str | None = None,
    department: str | None = None,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    query = db.query(Employee)
    if search:
        query = query.filter(
            or_(
                Employee.first_name.ilike(f"%{search}%"),
                Employee.last_name.ilike(f"%{search}%"),
                Employee.email.ilike(f"%{search}%"),
                Employee.department.ilike(f"%{search}%"),
            )
        )
    if department:
        query = query.filter(Employee.department == department)
    return query.order_by(Employee.id).all()


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_admin),
):
    existing = db.query(Employee).filter(Employee.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    employee = Employee(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        phone=payload.phone,
        department=payload.department,
        position=payload.position,
        license_number=payload.license_number,
        role=payload.role,
        password_hash=hash_password(payload.password),
        is_active=payload.is_active,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return EmployeeRead(
        id=employee.id,
        first_name=employee.first_name,
        last_name=employee.last_name,
        email=employee.email,
        phone=employee.phone,
        department=employee.department,
        position=employee.position,
        license_number=employee.license_number,
        role=employee.role,
        is_active=employee.is_active,
        created_at=str(employee.created_at),
    )


@router.get("/me", response_model=EmployeeRead)
def read_current_user(current_user: Employee = Depends(get_current_user)):
    return EmployeeRead(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        phone=current_user.phone,
        department=current_user.department,
        position=current_user.position,
        license_number=current_user.license_number,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=str(current_user.created_at),
    )


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: int, db: Session = Depends(get_db), current_user: Employee = Depends(get_current_user)):
    _ = current_user
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return EmployeeRead(
        id=employee.id,
        first_name=employee.first_name,
        last_name=employee.last_name,
        email=employee.email,
        phone=employee.phone,
        department=employee.department,
        position=employee.position,
        license_number=employee.license_number,
        role=employee.role,
        is_active=employee.is_active,
        created_at=str(employee.created_at),
    )


@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(
    employee_id: int,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_admin),
):
    _ = current_user
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee.first_name = payload.first_name
    employee.last_name = payload.last_name
    employee.email = payload.email
    employee.phone = payload.phone
    employee.department = payload.department
    employee.position = payload.position
    employee.license_number = payload.license_number
    employee.role = payload.role
    employee.is_active = payload.is_active
    if payload.password:
        employee.password_hash = hash_password(payload.password)

    db.commit()
    db.refresh(employee)
    return EmployeeRead(
        id=employee.id,
        first_name=employee.first_name,
        last_name=employee.last_name,
        email=employee.email,
        phone=employee.phone,
        department=employee.department,
        position=employee.position,
        license_number=employee.license_number,
        role=employee.role,
        is_active=employee.is_active,
        created_at=str(employee.created_at),
    )


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db), current_user: Employee = Depends(require_admin)):
    _ = current_user
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()
    return None
