from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core.security import create_access_token, hash_password, verify_password
from ..database.database import get_db
from ..database.models import Employee

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str = Field(..., example="admin@example.com")
    password: str = Field(..., example="StrongPass123!")


class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    phone: str | None = None
    department: str | None = None
    position: str | None = None
    license_number: str | None = None
    role: str = "employee"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if db.query(Employee).filter(Employee.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    if payload.role not in {"admin", "fleet_manager", "employee"}:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = Employee(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        phone=payload.phone,
        department=payload.department,
        position=payload.position,
        license_number=payload.license_number,
        role=payload.role,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenResponse(access_token=create_access_token(user.id))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(Employee).filter(Employee.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is disabled")

    return TokenResponse(access_token=create_access_token(user.id))
