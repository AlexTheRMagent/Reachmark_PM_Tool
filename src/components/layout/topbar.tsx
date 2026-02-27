"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function Topbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-3 backdrop-blur">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") router.push(`/search?q=${encodeURIComponent(query)}`);
        }}
        placeholder="Global search tasks, docs, goals..."
        className="w-full max-w-lg rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="ml-4">
        <Button onClick={() => router.push("/notifications")}>Notifications</Button>
      </div>
    </header>
  );
}
