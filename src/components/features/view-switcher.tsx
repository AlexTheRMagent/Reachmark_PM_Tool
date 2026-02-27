"use client";

import { useUIStore } from "@/store/ui-store";

const views = ["list", "board", "calendar", "table"] as const;

export function ViewSwitcher() {
  const currentView = useUIStore((s) => s.currentView);
  const setView = useUIStore((s) => s.setView);

  return (
    <div className="mb-4 flex gap-2">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => setView(view)}
          className={`rounded border px-3 py-1 text-sm ${currentView === view ? "border-brand-700 bg-brand-50 text-brand-900" : "border-slate-300"}`}
        >
          {view}
        </button>
      ))}
    </div>
  );
}
