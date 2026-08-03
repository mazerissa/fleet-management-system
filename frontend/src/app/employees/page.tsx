"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import DataTable from "@/components/DataTable";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Employee[]>('/employees')
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load employees.');
        setLoading(false);
      });
  }, []);

  const headers = ['ID', 'Name', 'Email', 'Role', 'Active'];
  const rows = employees.map((employee) => [
    String(employee.id),
    employee.name,
    employee.email,
    employee.role,
    employee.active ? 'Yes' : 'No',
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-slate-500 mt-2">View and manage fleet staff assignments.</p>
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <DataTable headers={headers} rows={rows} />
        </div>
      )}
    </div>
  );
}
