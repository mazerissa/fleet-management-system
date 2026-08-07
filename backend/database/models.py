from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship

Base = declarative_base()


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(128), nullable=False)
    last_name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    department: Mapped[str | None] = mapped_column(String(128), nullable=True)
    position: Mapped[str | None] = mapped_column(String(128), nullable=True)
    license_number: Mapped[str | None] = mapped_column(String(64), nullable=True)
    role: Mapped[str] = mapped_column(String(64), nullable=False, default="employee")
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    assignments: Mapped[list["Assignment"]] = relationship(back_populates="employee", cascade="all, delete-orphan")
    mileage_entries: Mapped[list["MileageEntry"]] = relationship(back_populates="employee", cascade="all, delete-orphan")
    vehicles: Mapped[list["Vehicle"]] = relationship(back_populates="assigned_employee")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand: Mapped[str] = mapped_column(String(128), nullable=False)
    model: Mapped[str] = mapped_column(String(128), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    license_plate: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    vin: Mapped[str | None] = mapped_column(String(64), nullable=True)
    mileage: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fuel_type: Mapped[str] = mapped_column(String(64), nullable=False, default="diesel")
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="available")
    assigned_employee_id: Mapped[int | None] = mapped_column(ForeignKey("employees.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    assigned_employee: Mapped[Employee | None] = relationship(back_populates="vehicles")
    assignments: Mapped[list["Assignment"]] = relationship(back_populates="vehicle", cascade="all, delete-orphan")
    mileage_entries: Mapped[list["MileageEntry"]] = relationship(back_populates="vehicle", cascade="all, delete-orphan")


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    vehicle: Mapped[Vehicle] = relationship(back_populates="assignments")
    employee: Mapped[Employee] = relationship(back_populates="assignments")


class MileageEntry(Base):
    __tablename__ = "mileage_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    entry_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    mileage: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    vehicle: Mapped[Vehicle] = relationship(back_populates="mileage_entries")
    employee: Mapped[Employee] = relationship(back_populates="mileage_entries")
