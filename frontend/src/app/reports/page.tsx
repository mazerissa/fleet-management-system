
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { isAuthenticated } from "@/lib/auth";

interface ReportSummary {
  total_vehicles: number;
  available_vehicles: number;
  maintenance_vehicles: number;
  total_employees: number;
}

interface VehicleUsageReport {
  vehicle_id: number;
  brand: string;
  model: string;
  license_plate: string;
  mileage: number;
  status: string;
}

interface EmployeeAssignmentReport {
  employee_id: number;
  employee_name: string;
  vehicle_count: number;
}

export default function Reports() {
  const api = useAxios();
  const authenticated = isAuthenticated();

  const summaryQuery = useQuery({
    queryKey: ["reportSummary"],
    queryFn: async () => {
      const response = await api.get<ReportSummary>("/reports/summary");
      return response.data;
    },
    enabled: authenticated,
  });

  const vehicleReportsQuery = useQuery({
    queryKey: ["reportVehicles"],
    queryFn: async () => {
      const response = await api.get<VehicleUsageReport[]>("/reports/vehicles");
      return response.data;
    },
    enabled: authenticated,
  });

  const employeeReportsQuery = useQuery({
    queryKey: ["reportEmployees"],
    queryFn: async () => {
      const response = await api.get<EmployeeAssignmentReport[]>("/reports/employees");
      return response.data;
    },
    enabled: authenticated,
  });

  const summary = summaryQuery.data;
  const topVehicles = vehicleReportsQuery.data ?? [];
  const topEmployees = employeeReportsQuery.data ?? [];

  if (!authenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-slate-500 mt-2">Sign in to view fleet usage reports.</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-slate-700">Reports require an authenticated session.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-slate-500 mt-2">Fleet usage summaries, vehicle health, and assignment insights.</p>
      </div>

      {summaryQuery.isLoading ? (
        <p>Loading report summary...</p>
      ) : summaryQuery.isError || !summary ? (
        <p className="text-red-600">Unable to load report summary.</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-4">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total vehicles</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.total_vehicles}</p>
          </div>
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Available vehicles</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.available_vehicles}</p>
          </div>
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Maintenance vehicles</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.maintenance_vehicles}</p>
          </div>
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total employees</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.total_employees}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Active vehicle assignments</h2>
          {vehicleReportsQuery.isLoading ? (
            <p>Loading vehicle report...</p>
          ) : vehicleReportsQuery.isError ? (
            <p className="text-red-600">Unable to load vehicle assignment report.</p>
          ) : (
            <div className="space-y-3 mt-4">
              {topVehicles.slice(0, 5).map((vehicle) => (
                <div key={vehicle.vehicle_id} className="rounded-2xl border p-4">
                  <p className="font-semibold">{vehicle.brand} {vehicle.model}</p>
                  <p className="text-sm text-slate-500">License: {vehicle.license_plate} • Status: {vehicle.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Employee assignment activity</h2>
          {employeeReportsQuery.isLoading ? (
            <p>Loading employee report...</p>
          ) : employeeReportsQuery.isError ? (
            <p className="text-red-600">Unable to load employee report.</p>
          ) : (
            <div className="space-y-3 mt-4">
              {topEmployees.slice(0, 5).map((employee) => (
                <div key={employee.employee_id} className="rounded-2xl border p-4">
                  <p className="font-semibold">{employee.employee_name}</p>
                  <p className="text-sm text-slate-500">Assignment count: {employee.vehicle_count}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
