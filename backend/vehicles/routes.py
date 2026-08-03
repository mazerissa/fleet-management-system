from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Vehicle

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


class VehicleBase(BaseModel):
    make: str = Field(..., example="Ford")
    model: str = Field(..., example="Transit")
    year: int = Field(..., example=2024)
    license_plate: str = Field(..., example="ABC-1234")
    status: str = Field("available", example="available")
    assigned_to: str | None = Field(None, example="Jane Doe")

    model_config = {
        "from_attributes": True
    }


class VehicleCreate(VehicleBase):
    pass


class VehicleRead(VehicleBase):
    id: int


@router.get("/", response_model=list[VehicleRead])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).order_by(Vehicle.id).all()


@router.post("/", response_model=VehicleRead, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate, db: Session = Depends(get_db)):
    existing = db.query(Vehicle).filter(Vehicle.license_plate == payload.license_plate).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="License plate already exists")

    vehicle = Vehicle(
        make=payload.make,
        model=payload.model,
        year=payload.year,
        license_plate=payload.license_plate,
        status=payload.status,
        assigned_to=payload.assigned_to,
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("/{vehicle_id}", response_model=VehicleRead)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleRead)
def update_vehicle(vehicle_id: int, payload: VehicleCreate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    for field, value in payload.model_dump().items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()
    return None
