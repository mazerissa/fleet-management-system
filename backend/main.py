from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.assignments.routes import router as assignments_router
from backend.auth.routes import router as auth_router
from backend.database.database import engine
from backend.database.models import Base
from backend.employees.routes import router as employees_router
from backend.reports.routes import router as reports_router
from backend.vehicles.routes import router as vehicles_router

app = FastAPI(title="Fleet Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Fleet Management API running"}


app.include_router(auth_router)
app.include_router(employees_router)
app.include_router(vehicles_router)
app.include_router(assignments_router)
app.include_router(reports_router)
