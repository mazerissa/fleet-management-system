from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..auth.dependencies import get_current_user, require_admin
from ..database.database import get_db
from ..database.models import Assignment, Employee, Vehicle

router = APIRouter(prefix="/assignments", tags=["assignments"])


class AssignmentCreate(BaseModel):
    vehicle_id: int
    employee_id: int
    start_date: datetime
    end_date: datetime | None = None
    notes: str | None = None


class AssignmentRead(BaseModel):
    id: int
    vehicle_id: int
    employee_id: int
    start_date: datetime
    end_date: datetime | None = None
    is_active: bool
    notes: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


@router.post("", response_model=AssignmentRead, status_code=status.HTTP_201_CREATED)
def create_assignment(
    payload: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_admin),
) -> AssignmentRead:
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not vehicle or not employee:
        raise HTTPException(status_code=404, detail="Vehicle or employee not found")

    if vehicle.status == "retired":
        raise HTTPException(status_code=400, detail="Cannot assign retired vehicle")

    if vehicle.assigned_employee_id and vehicle.assigned_employee_id != employee.id:
        raise HTTPException(status_code=400, detail="Vehicle is already assigned")

    if payload.end_date and payload.end_date < payload.start_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")

    vehicle.assigned_employee_id = employee.id
    vehicle.status = "assigned"

    assignment = Assignment(
        vehicle_id=payload.vehicle_id,
        employee_id=payload.employee_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        is_active=True,
        notes=payload.notes,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.get("/history", response_model=list[AssignmentRead])
def get_assignment_history(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
) -> list[AssignmentRead]:
    _ = current_user
    return db.query(Assignment).order_by(Assignment.created_at.desc()).all()
