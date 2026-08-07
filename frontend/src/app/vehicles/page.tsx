
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { isAuthenticated } from "@/lib/auth";
import DataTable from "@/components/DataTable";

interface VehicleSummary {
  id: number;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  status: string;
  assigned_employee_id: number | null;
}

export default function Vehicles() {
  const api = useAxios();
  const authenticated = isAuthenticated();

  const vehiclesQuery = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await api.get<VehicleSummary[]>("/vehicles");
      return response.data;
    },
    enabled: authenticated,
  });

  const rows = useMemo(
    () =>
      vehiclesQuery.data?.map((vehicle) => [
        String(vehicle.id),
        vehicle.brand,
        vehicle.model,
        String(vehicle.year),
        vehicle.license_plate,
        vehicle.status,
        vehicle.assigned_employee_id ? String(vehicle.assigned_employee_id) : "-",
      ]) ?? [],
    [vehiclesQuery.data],
  );

  const headers = ["ID", "Brand", "Model", "Year", "License", "Status", "Assigned"];

  if (!authenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <p className="text-slate-500 mt-2">Login to inspect vehicle assignments and status.</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-slate-700">Please sign in to access the fleet vehicle list.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <p className="text-slate-500 mt-2">Manage fleet vehicles and view assignment status.</p>
      </div>

      {vehiclesQuery.isLoading ? (
        <p>Loading vehicles...</p>
      ) : vehiclesQuery.isError ? (
        <p className="text-red-600">Unable to load vehicles.</p>
      ) : (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <DataTable headers={headers} rows={rows} />
        </div>
      )}
    </div>
  );
}
