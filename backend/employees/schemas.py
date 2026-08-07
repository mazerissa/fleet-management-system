from pydantic import BaseModel, Field


class EmployeeBase(BaseModel):
    first_name: str = Field(..., example="Jane")
    last_name: str = Field(..., example="Doe")
    email: str = Field(..., example="jane@example.com")
    phone: str | None = Field(None, example="+123456789")
    department: str | None = Field(None, example="Operations")
    position: str | None = Field(None, example="Fleet Coordinator")
    license_number: str | None = Field(None, example="LIC-123")
    role: str = Field("employee", example="fleet_manager")
    is_active: bool = Field(True, example=True)

    model_config = {"from_attributes": True}


class EmployeeCreate(EmployeeBase):
    password: str = Field(..., example="StrongPass123!")


class EmployeeUpdate(EmployeeBase):
    password: str | None = Field(None, example="StrongPass123!")


from datetime import datetime


class EmployeeRead(EmployeeBase):
    id: int
    created_at: datetime
