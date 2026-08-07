import os
import sys

import pytest
from fastapi.testclient import TestClient

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app
from backend.database.database import engine
from backend.database.models import Base


@pytest.fixture(scope="function")
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as test_client:
        yield test_client
    Base.metadata.drop_all(bind=engine)


def test_register_login_and_employee_crud(client):
    register_response = client.post(
        "/auth/register",
        json={
            "first_name": "Admin",
            "last_name": "User",
            "email": "admin@example.com",
            "password": "StrongPass123!",
            "phone": "+123456789",
            "department": "Operations",
            "position": "Director",
            "license_number": "LIC-001",
            "role": "admin",
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        json={"email": "admin@example.com", "password": "StrongPass123!"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    employee_response = client.post(
        "/employees",
        json={
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane@example.com",
            "phone": "+1234567890",
            "department": "Logistics",
            "position": "Fleet Coordinator",
            "license_number": "LIC-002",
            "role": "fleet_manager",
            "password": "StrongPass123!",
        },
        headers=headers,
    )
    assert employee_response.status_code == 201

    employees_response = client.get("/employees", headers=headers)
    assert employees_response.status_code == 200
    assert len(employees_response.json()) >= 1
