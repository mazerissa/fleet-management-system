from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Employee


def get_user_by_email(email: str | None, db: Session) -> Employee | None:
    if not email:
        return None
    return db.query(Employee).filter(Employee.email == email).first()


def get_current_user(
    x_user_email: str | None = Header(None, alias="X-User-Email"),
    db: Session = Depends(get_db),
) -> Employee:
    user = get_user_by_email(x_user_email, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing user email",
        )
    return user


def get_optional_current_user(
    x_user_email: str | None = Header(None, alias="X-User-Email"),
    db: Session = Depends(get_db),
) -> Employee | None:
    if not x_user_email:
        return None
    return get_user_by_email(x_user_email, db)


def require_admin(current_user: Employee = Depends(get_current_user)) -> Employee:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user
