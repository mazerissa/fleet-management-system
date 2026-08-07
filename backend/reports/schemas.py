from pydantic import BaseModel, Field


class ReportSummary(BaseModel):
    total_vehicles: int
    available_vehicles: int
    maintenance_vehicles: int
    total_employees: int


class VehicleUsageReport(BaseModel):
    vehicle_id: int
    brand: str
    model: str
    license_plate: str
    mileage: int
    status: str


class EmployeeAssignmentReport(BaseModel):
    employee_id: int
    employee_name: str
    vehicle_count: int


class MileageReport(BaseModel):
    vehicle_id: int
    license_plate: str
    mileage: int
    status: str
