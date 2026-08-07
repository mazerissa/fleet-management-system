from pydantic import BaseModel, Field


class VehicleBase(BaseModel):
    brand: str = Field(..., example="Ford")
    model: str = Field(..., example="Transit")
    year: int = Field(..., example=2024)
    license_plate: str = Field(..., example="ABC-1234")
    vin: str | None = Field(None, example="VIN123")
    mileage: int = Field(0, example=12500)
    fuel_type: str = Field("diesel", example="diesel")
    status: str = Field("available", example="assigned")
    assigned_employee_id: int | None = Field(None, example=1)

    model_config = {"from_attributes": True}


class VehicleCreate(VehicleBase):
    pass


from datetime import datetime


class VehicleRead(VehicleBase):
    id: int
    created_at: datetime
