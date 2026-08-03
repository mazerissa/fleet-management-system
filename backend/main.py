from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.database import engine
from .database.models import Base
from .vehicles.routes import router as vehicles_router
from .employees.routes import router as employees_router

app = FastAPI(
    title="Fleet Management API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "Fleet Management API running"
    }


app.include_router(vehicles_router)
app.include_router(employees_router)
