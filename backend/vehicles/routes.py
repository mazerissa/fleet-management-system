from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth.dependencies import get_current_user, require_admin
from ..database.database import get_db
from ..database.models import Employee, Vehicle
from .schemas import VehicleCreate, VehicleRead

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("", response_model=list[VehicleRead])
def list_vehicles(
    status: str | None = None,
    assigned_employee_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    query = db.query(Vehicle)
    if status:
        query = query.filter(Vehicle.status == status)
    if assigned_employee_id is not None:
        query = query.filter(Vehicle.assigned_employee_id == assigned_employee_id)

    return query.order_by(Vehicle.id).all()


@router.post("", response_model=VehicleRead, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate, db: Session = Depends(get_db), current_user: Employee = Depends(require_admin)):
    _ = current_user
    existing = db.query(Vehicle).filter(Vehicle.license_plate == payload.license_plate).first()
    if existing:
        raise HTTPException(status_code=400, detail="License plate already exists")

    vehicle = Vehicle(
        brand=payload.brand,
        model=payload.model,
        year=payload.year,
        license_plate=payload.license_plate,
        vin=payload.vin,
        mileage=payload.mileage,
        fuel_type=payload.fuel_type,
        status=payload.status,
        assigned_employee_id=payload.assigned_employee_id,
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return VehicleRead(
        id=vehicle.id,
        brand=vehicle.brand,
        model=vehicle.model,
        year=vehicle.year,
        license_plate=vehicle.license_plate,
        vin=vehicle.vin,
        mileage=vehicle.mileage,
        fuel_type=vehicle.fuel_type,
        status=vehicle.status,
        assigned_employee_id=vehicle.assigned_employee_id,
        created_at=str(vehicle.created_at),
    )


@router.get("/{vehicle_id}", response_model=VehicleRead)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: Employee = Depends(get_current_user)):
    _ = current_user
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehicleRead(
        id=vehicle.id,
        brand=vehicle.brand,
        model=vehicle.model,
        year=vehicle.year,
        license_plate=vehicle.license_plate,
        vin=vehicle.vin,
        mileage=vehicle.mileage,
        fuel_type=vehicle.fuel_type,
        status=vehicle.status,
        assigned_employee_id=vehicle.assigned_employee_id,
        created_at=str(vehicle.created_at),
    )


@router.put("/{vehicle_id}", response_model=VehicleRead)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(require_admin),
):
    _ = current_user
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    vehicle.brand = payload.brand
    vehicle.model = payload.model
    vehicle.year = payload.year
    vehicle.license_plate = payload.license_plate
    vehicle.vin = payload.vin
    vehicle.mileage = payload.mileage
    vehicle.fuel_type = payload.fuel_type
    vehicle.status = payload.status
    vehicle.assigned_employee_id = payload.assigned_employee_id

    db.commit()
    db.refresh(vehicle)
    return VehicleRead(
        id=vehicle.id,
        brand=vehicle.brand,
        model=vehicle.model,
        year=vehicle.year,
        license_plate=vehicle.license_plate,
        vin=vehicle.vin,
        mileage=vehicle.mileage,
        fuel_type=vehicle.fuel_type,
        status=vehicle.status,
        assigned_employee_id=vehicle.assigned_employee_id,
        created_at=str(vehicle.created_at),
    )


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: Employee = Depends(require_admin)):
    _ = current_user
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()
    return None
