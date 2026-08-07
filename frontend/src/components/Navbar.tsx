
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">
      <div>
        <h2 className="font-semibold text-xl">Dashboard</h2>
        <p className="text-sm text-slate-500">Monitor your fleet activity</p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Login
        </Link>
        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}
