from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Employee, Vehicle
from .schemas import EmployeeAssignmentReport, MileageReport, ReportSummary, VehicleUsageReport

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary", response_model=ReportSummary)
def get_summary(db: Session = Depends(get_db)) -> ReportSummary:
    total_vehicles = db.query(Vehicle).count()
    available_vehicles = db.query(Vehicle).filter(Vehicle.status == "available").count()
    maintenance_vehicles = db.query(Vehicle).filter(Vehicle.status == "maintenance").count()
    total_employees = db.query(Employee).count()
    return ReportSummary(
        total_vehicles=total_vehicles,
        available_vehicles=available_vehicles,
        maintenance_vehicles=maintenance_vehicles,
        total_employees=total_employees,
    )


@router.get("/vehicles", response_model=list[VehicleUsageReport])
def get_vehicle_reports(db: Session = Depends(get_db)) -> list[VehicleUsageReport]:
    vehicles = db.query(Vehicle).all()
    return [
        VehicleUsageReport(
            vehicle_id=vehicle.id,
            brand=vehicle.brand,
            model=vehicle.model,
            license_plate=vehicle.license_plate,
            mileage=vehicle.mileage,
            status=vehicle.status,
        )
        for vehicle in vehicles
    ]


@router.get("/employees", response_model=list[EmployeeAssignmentReport])
def get_employee_reports(db: Session = Depends(get_db)) -> list[EmployeeAssignmentReport]:
    employees = db.query(Employee).all()
    return [
        EmployeeAssignmentReport(
            employee_id=employee.id,
            employee_name=f"{employee.first_name} {employee.last_name}",
            vehicle_count=len(employee.vehicles),
        )
        for employee in employees
    ]


@router.get("/mileage", response_model=list[MileageReport])
def get_mileage_reports(db: Session = Depends(get_db)) -> list[MileageReport]:
    vehicles = db.query(Vehicle).all()
    return [
        MileageReport(
            vehicle_id=vehicle.id,
            license_plate=vehicle.license_plate,
            mileage=vehicle.mileage,
            status=vehicle.status,
        )
        for vehicle in vehicles
    ]
