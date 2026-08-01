from sqlachemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATEBASE_URL
)

SessionLocal = sessionmaker(
    autocommit=False,
    expire_on_commit=False,
    bind=engine
)