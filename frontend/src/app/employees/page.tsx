"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import useAxios from "@/hooks/useAxios";
import DataTable from "@/components/DataTable";
import { isAuthenticated } from "@/lib/auth";

interface EmployeeSummary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface EmployeeCreatePayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
}

export default function Employees() {
  const api = useAxios();
  const queryClient = useQueryClient();
  const authenticated = isAuthenticated();

  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("employee");
  const [formActive, setFormActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const currentUserQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get<EmployeeSummary>("/employees/me");
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

  const createEmployee = useMutation({
    mutationFn: async (payload: EmployeeCreatePayload) => {
      const response = await api.post<EmployeeSummary>("/employees", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setFormSuccess("Employee created successfully.");
      setFormError(null);
      setFormFirstName("");
      setFormLastName("");
      setFormEmail("");
      setFormPassword("");
      setFormRole("employee");
      setFormActive(true);
    },
    onError: (error: any) => {
      setFormError(error?.response?.data?.detail || "Unable to create employee.");
    },
  });

  const canCreate = currentUserQuery.data?.role === "admin" || !currentUserQuery.data;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError(null);
    setFormSuccess(null);
    await createEmployee.mutateAsync({
      first_name: formFirstName,
      last_name: formLastName,
      email: formEmail,
      password: formPassword,
      role: formRole,
      is_active: formActive,
    });
  };

  const headers = ["ID", "Name", "Email", "Role", "Active"];
  const rows = employeesQuery.data?.map((employee) => [
    String(employee.id),
    `${employee.first_name} ${employee.last_name}`,
    employee.email,
    employee.role,
    employee.is_active ? "Yes" : "No",
  ]) ?? [];

  if (!authenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-slate-500 mt-2">Login to manage your employee roster and roles.</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-slate-700">You need to sign in before viewing employees.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-slate-500 mt-2">View and manage fleet staff assignments.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Current user</h2>
          {currentUserQuery.isLoading ? (
            <p>Loading current user...</p>
          ) : currentUserQuery.error ? (
            <p className="text-red-600">Unable to load current user.</p>
          ) : currentUserQuery.data ? (
            <div className="space-y-3">
              <p>
                <strong>Email:</strong> {currentUserQuery.data.email}
              </p>
              <p>
                <strong>Role:</strong> {currentUserQuery.data.role}
              </p>
            </div>
          ) : (
            <p className="text-slate-600">No current user information available.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add employee</h2>
          {currentUserQuery.data?.role !== "admin" && (
            <p className="text-red-600 mb-4">
              Only admins may add new employees. Sign in with an admin account to continue.
            </p>
          )}
          {formError && <p className="text-red-600 mb-4">{formError}</p>}
          {formSuccess && <p className="text-green-600 mb-4">{formSuccess}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">First name</span>
                <input
                  type="text"
                  value={formFirstName}
                  onChange={(event) => setFormFirstName(event.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  required
                  disabled={currentUserQuery.data?.role !== "admin"}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Last name</span>
                <input
                  type="text"
                  value={formLastName}
                  onChange={(event) => setFormLastName(event.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  required
                  disabled={currentUserQuery.data?.role !== "admin"}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={formEmail}
                onChange={(event) => setFormEmail(event.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                required
                disabled={currentUserQuery.data?.role !== "admin"}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={formPassword}
                onChange={(event) => setFormPassword(event.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                required
                disabled={currentUserQuery.data?.role !== "admin"}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Role</span>
                <select
                  value={formRole}
                  onChange={(event) => setFormRole(event.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  disabled={currentUserQuery.data?.role !== "admin"}
                >
                  <option value="employee">Employee</option>
                  <option value="fleet_manager">Fleet Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(event) => setFormActive(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  disabled={currentUserQuery.data?.role !== "admin"}
                />
                <span className="text-sm text-slate-700">Active</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={createEmployee.isLoading || currentUserQuery.data?.role !== "admin"}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createEmployee.isLoading ? "Saving..." : "Add employee"}
            </button>
          </form>
        </div>
      </div>

      {employeesQuery.isLoading ? (
        <p>Loading employees...</p>
      ) : employeesQuery.isError ? (
        <p className="text-red-600">Unable to load employees.</p>
      ) : (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <DataTable headers={headers} rows={rows} />
        </div>
      )}
    </div>
  );
}
