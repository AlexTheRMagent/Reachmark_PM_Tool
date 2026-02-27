import Link from "next/link";

import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="mb-1 text-2xl font-semibold">Reachmark Login</h1>
        <p className="mb-4 text-sm text-slate-600">Credentials auth only (email/password)</p>
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/home"
            });
          }}
          className="space-y-3"
        >
          <input name="email" type="email" required placeholder="demo@reachmark.dev" className="w-full rounded border px-3 py-2" />
          <input name="password" type="password" required placeholder="demo1234" className="w-full rounded border px-3 py-2" />
          <button className="w-full rounded bg-brand-700 px-3 py-2 text-white">Sign in</button>
        </form>
        <p className="mt-3 text-xs text-slate-500">No account? <Link href="/api/register" className="text-brand-700">Create seeded user via API</Link></p>
      </div>
    </div>
  );
}
