
import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-8">
      <div className="rounded-3xl border bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold">Fleet Management System</h1>
        <p className="mt-4 text-slate-600">
          Manage your vehicles, employees, assignments, and reports from a modern fleet dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-900 hover:bg-slate-50"
          >
            View dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Fleet overview</h2>
          <p className="mt-2 text-slate-600">See vehicle availability, assignments, and maintenance status in one place.</p>
        </section>
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Team management</h2>
          <p className="mt-2 text-slate-600">Add employees, assign drivers, and keep your fleet running smoothly.</p>
        </section>
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Reporting</h2>
          <p className="mt-2 text-slate-600">Monitor performance with centralized reporting and summaries.</p>
        </section>
      </div>
    </main>
  );
}
