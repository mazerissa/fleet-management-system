"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  status: string;
  assigned_to: string | null;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [vehiclesResponse, employeesResponse] = await Promise.all([
        api.get<Vehicle[]>("/vehicles"),
        api.get<Employee[]>("/employees"),
      ]);

      setVehicles(vehiclesResponse.data);
      setEmployees(employeesResponse.data);
    } catch {
      setError("Unable to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Vehicles",
      value: String(vehicles.length),
    },
    {
      title: "Active Employees",
      value: String(employees.filter((employee) => employee.active).length),
    },
    {
      title: "Driver Count",
      value: String(employees.filter((employee) => employee.role === "driver").length),
    },
    {
      title: "Assigned Vehicles",
      value: String(vehicles.filter((vehicle) => Boolean(vehicle.assigned_to)).length),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Fleet Overview</h1>
        <p className="text-slate-500">Track vehicles, employees and usage statistics.</p>
      </div>

      {loading ? (
        <p>Loading dashboard metrics...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
            >
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="text-3xl font-bold mt-3">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h2 className="font-semibold text-lg">Recent Activity</h2>
        <p className="text-slate-500 mt-3">No activity recorded yet.</p>
      </div>
    </div>
  );
}
