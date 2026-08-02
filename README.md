# Fleet Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-development-orange.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

> A modern fleet management platform for monitoring vehicles, employees, mileage, permissions, and operational reports.

---

#  Table of Contents

- [Overview](#-overview)
- [ Features](#-features)
- [ Architecture](#-architecture)
- [ Tech Stack](#-tech-stack)
- [ Getting Started](#-getting-started)
- [ Project Setup](#-project-setup)
- [ Environment Variables](#-environment-variables)
- [ Usage](#-usage)
- [ Project Structure](#-project-structure)
- [ User Roles & Permissions](#-user-roles--permissions)
- [ Reporting System](#-reporting-system)
- [ Testing](#-testing)
- [ Contributing](#-contributing)
- [ License](#-license)

---

#  Overview

Fleet Management System is a full-stack application built to help businesses manage company vehicles, employee assignments, mileage tracking, and operational reporting.

The platform offers vehicle and employee management, customizable permissions, usage monitoring, data import, and reporting tools.

This repository separates frontend and backend responsibilities for easier maintenance and extension.

---

#  Features

##  Vehicle Management

- Add, update, and remove vehicles
- Store registration, model, and status details
- Track assignment history and availability
- Monitor maintenance and repair status

##  Employee Management

- Create and manage employee accounts
- Assign vehicles to employees
- Track usage and activity history
- Control access levels by role

##  Role-Based Access Control

- Configure roles and permissions
- Restrict actions by role
- Secure access to vehicles, users, and reports

Example roles:

- Administrator
- Manager
- Fleet Operator
- Employee
- Viewer
uvicorn main:app --reload
##  Mileage & Usage Tracking

- Monitor weekly mileage limits
- Detect excess or weekend usage
- Generate usage alerts and cost estimates
- Track trends over time

##  Reporting

- Generate vehicle usage reports
- Review employee activity summaries
- Analyze mileage statistics
- Export data to PDF, CSV, or Excel

##  Data Import

- Import CSV and Excel files
- Bulk-create records from uploads
- Validate imported data automatically

##  Search & Filtering

- Search vehicles, employees, users, and reports
- Filter records by status, date, or assignment
- Access fleet data quickly

##  Multi-language Support

- English
- French

Planned languages: German, Hungarian, and more.

---

#  Architecture

This repository follows a standard full-stack layout:

```text
Users
  └─ Frontend (Next.js)
        └─ Backend (FastAPI)
              └─ PostgreSQL
```

- `frontend/` contains the Next.js application.
- `backend/` contains the FastAPI service.
- `docker-compose.yml` orchestrates database and services.

---

#  Tech Stack

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Axios
- React Query

## Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic

## Database

- PostgreSQL

## Infrastructure

- Docker
- Docker Compose

---

#  Getting Started

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker Desktop
- Git

---

## Clone the repository

```bash
git clone https://github.com/mazerissa/fleet-management-system.git
cd fleet-management
```

> Replace the repository URL with the correct remote if needed.

---

#  Project Setup

## Backend setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

Windows:

```bash
venv\\Scripts\\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn main:app --reload
```

Open:

- http://localhost:8000
- http://localhost:8000/docs

---

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open:

- http://localhost:3000

---

#  Environment Variables

## Backend

Create `backend/.env` with:

```env
DATABASE_URL=postgresql://fleet_user:fleet_password@localhost:5432/fleet_db
SECRET_KEY=change_this_secret
```

## Frontend

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

#  Usage

1. Start the database and backend services.
2. Start the frontend application.
3. Open the frontend at `http://localhost:3000`.
4. Use the app to manage vehicles, employees, and reports.

---

#  Project Structure

```text
fleet-management/

├── backend/
│   ├── auth/
│   ├── users/
│   ├── employees/
│   ├── vehicles/
│   ├── reports/
│   ├── database/
│   ├── core/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── employees/
│   │   ├── reports/
│   │   └── settings/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── DataTable.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   └── package.json
│
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

#  User Roles & Permissions

The system supports role-based access control with configurable permissions.

Permissions can include:

- View Vehicles
- Edit Vehicles
- Delete Vehicles
- Manage Employees
- View Reports
- Configure Settings

Administrators can update role definitions from the dashboard.

---

#  Reporting System

Reports support operational monitoring and long-term analysis:

- Vehicle utilization
- Employee driving behavior
- Mileage violations
- Cost estimation
- Fleet efficiency

---

#  Testing

## Backend

```bash
cd backend
pytest
```

## Frontend

```bash
cd frontend
npm run test
```

---

#  Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-change`
3. Commit your changes: `git commit -m "Add feature description"`
4. Push your branch: `git push origin feature/my-change`
5. Open a pull request.

---

# 📄 License

This project is licensed under the MIT License.
