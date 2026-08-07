
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (typeof window !== "undefined" && isAuthenticated()) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="mt-2 text-slate-500">Use your fleet credentials to access management tools.</p>
        <LoginForm
          onSuccess={() => {
            setError(null);
            router.push('/dashboard');
          }}
        />
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
}
