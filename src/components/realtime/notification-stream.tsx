"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function NotificationStream() {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const socket = io(`http://localhost:${process.env.NEXT_PUBLIC_SOCKET_PORT || "3001"}`);

    socket.on("connect", () => setEvents((curr) => ["Realtime connected", ...curr].slice(0, 4)));
    socket.on("task:created", (payload) => setEvents((curr) => [`Task created: ${payload.title}`, ...curr].slice(0, 4)));
    socket.on("comment:created", () => setEvents((curr) => ["New comment posted", ...curr].slice(0, 4)));
    socket.on("automation:created", (payload) => setEvents((curr) => [`Automation created: ${payload.name}`, ...curr].slice(0, 4)));

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="mb-4 rounded border border-brand-100 bg-brand-50 p-3">
      <p className="mb-2 text-sm font-medium">Realtime feed</p>
      {events.length === 0 ? <p className="text-xs text-slate-600">No live events yet</p> : events.map((e, i) => <p key={`${e}-${i}`} className="text-xs">{e}</p>)}
    </div>
  );
}
