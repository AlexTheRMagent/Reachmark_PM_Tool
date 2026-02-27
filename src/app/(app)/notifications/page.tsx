import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationStream } from "@/components/realtime/notification-stream";

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = await prisma.notification.findMany({ where: { userId: session!.user.id }, orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Notifications Center</h1>
      <NotificationStream />
      <form action="/api/notifications" method="post" className="mb-4">
        <input type="hidden" name="action" value="mark-all-read" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Mark all as read</button>
      </form>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={`rounded border p-3 ${n.read ? "bg-white" : "bg-brand-50"}`}>
            <p className="text-sm font-medium">{n.type}</p>
            <p className="text-xs text-slate-600">{JSON.stringify(n.payload)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
