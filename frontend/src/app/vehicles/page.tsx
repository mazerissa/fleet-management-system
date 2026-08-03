"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import DataTable from "@/components/DataTable";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  status: string;
  assigned_to: string | null;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Vehicle[]>('/vehicles')
      .then((response) => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load vehicles.');
        setLoading(false);
      });
  }, []);

  const headers = [
    'ID',
    'Make',
    'Model',
    'Year',
    'License',
    'Status',
    'Assigned To',
  ];

  const rows = vehicles.map((vehicle) => [
    String(vehicle.id),
    vehicle.make,
    vehicle.model,
    String(vehicle.year),
    vehicle.license_plate,
    vehicle.status,
    vehicle.assigned_to || '-',
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <p className="text-slate-500 mt-2">Manage fleet vehicles and view assignment status.</p>
      </div>

      {loading ? (
        <p>Loading vehicles...</p>
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
