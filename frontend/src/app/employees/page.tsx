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
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("user");
  const [formActive, setFormActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmployees();
    loadCurrentUser();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    setError(null);

    api
      .get<Employee[]>("/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch(() => {
        setError("Unable to load employees.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadCurrentUser = async (email?: string) => {
    if (typeof window !== "undefined" && email) {
      window.localStorage.setItem("fleet_user_email", email);
    }

    try {
      const response = await api.get<Employee>("/employees/me");
      setCurrentUser(response.data);
      setLoginError(null);
    } catch {
      setCurrentUser(null);
      if (email) {
        setLoginError("Login failed. Please use a registered user email.");
      }
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    await loadCurrentUser(loginEmail);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("fleet_user_email");
    }
    setCurrentUser(null);
    setLoginEmail("");
    setLoginError(null);
  };

  const hasAdmin = employees.some((employee) => employee.role === "admin");
  const canCreate = !hasAdmin || currentUser?.role === "admin";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);

    try {
      const payload = {
        name: formName,
        email: formEmail,
        role: formRole,
        active: formActive,
      };

      const response = await api.post<Employee>("/employees", payload);
      setEmployees((prev) => [...prev, response.data]);
      setFormSuccess("Employee created successfully.");
      setFormName("");
      setFormEmail("");
      setFormRole("user");
      setFormActive(true);
    } catch (e: any) {
      setFormError(e?.response?.data?.detail || "Unable to create employee.");
    } finally {
      setSaving(false);
    }
  };

  const headers = ["ID", "Name", "Email", "Role", "Active"];
  const rows = employees.map((employee) => [
    String(employee.id),
    employee.name,
    employee.email,
    employee.role,
    employee.active ? "Yes" : "No",
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-slate-500 mt-2">View and manage fleet staff assignments.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          {currentUser ? (
            <div className="space-y-3">
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p>
                <strong>Role:</strong> {currentUser.role}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-slate-600">Login by email to act as that user.</p>
              {loginError && <p className="text-red-600">{loginError}</p>}
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="admin@example.com"
                  required
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Login
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add Employee / Driver / Admin</h2>
          {!canCreate && (
            <p className="text-red-600 mb-4">
              Only admins can create new users once an admin exists. Log in as an admin or create the first admin account.
            </p>
          )}
          {formError && <p className="text-red-600 mb-4">{formError}</p>}
          {formSuccess && <p className="text-green-600 mb-4">{formSuccess}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="Jane Doe"
                  required
                  disabled={!canCreate}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(event) => setFormEmail(event.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="jane.doe@example.com"
                  required
                  disabled={!canCreate}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Role</span>
                <select
                  value={formRole}
                  onChange={(event) => setFormRole(event.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  disabled={!canCreate}
                >
                  <option value="user">User</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(event) => setFormActive(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  disabled={!canCreate}
                />
                <span className="text-sm text-slate-700">Active</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving || !canCreate}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add Employee"}
            </button>
          </form>
        </div>
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
