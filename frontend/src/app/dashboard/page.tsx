"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface VehicleSummary {
  id: number;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  status: string;
  assigned_employee_id: number | null;
}

interface EmployeeSummary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export default function Dashboard() {
  const authenticated = isAuthenticated();

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await api.get<VehicleSummary[]>("/vehicles");
      return response.data;
    },
    enabled: authenticated,
  });

  const employeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get<EmployeeSummary[]>("/employees");
      return response.data;
    },
    enabled: authenticated,
  });

  const vehicles = vehiclesQuery.data ?? [];
  const employees = employeesQuery.data ?? [];
  const loading = !authenticated || vehiclesQuery.isLoading || employeesQuery.isLoading;
  const error = (!authenticated && !vehiclesQuery.data) || vehiclesQuery.isError || employeesQuery.isError;

  const cards = useMemo(
    () => [
      { title: "Total vehicles", value: String(vehicles.length) },
      { title: "Available vehicles", value: String(vehicles.filter((vehicle) => vehicle.status === "available").length) },
      { title: "Vehicles in maintenance", value: String(vehicles.filter((vehicle) => vehicle.status === "maintenance").length) },
      { title: "Total employees", value: String(employees.length) },
    ],
    [vehicles, employees],
  );

  if (!authenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
          <p className="text-slate-500">Sign in to view your company fleet analytics.</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-slate-700">You need to login to fetch dashboard metrics.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
        <p className="text-slate-500">Company fleet performance and summary metrics.</p>
      </div>

      {loading ? (
        <p>Loading dashboard metrics...</p>
      ) : error ? (
        <p className="text-red-600">Unable to load dashboard data.</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Vehicle status overview</h2>
          <p className="mt-2 text-slate-600">Live fleet availability and maintenance status.</p>
          <div className="mt-6 grid gap-4">
            {vehicles.slice(0, 5).map((vehicle) => (
              <div key={vehicle.id} className="rounded-2xl border p-4">
                <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
                <p className="text-sm text-slate-500">{vehicle.license_plate} • {vehicle.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Employee summary</h2>
          <p className="mt-2 text-slate-600">Key staff currently managing fleet assignments.</p>
          <div className="mt-6 grid gap-4">
            {employees.slice(0, 5).map((employee) => (
              <div key={employee.id} className="rounded-2xl border p-4">
                <h3 className="font-semibold">{employee.first_name} {employee.last_name}</h3>
                <p className="text-sm text-slate-500">{employee.email} • {employee.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
