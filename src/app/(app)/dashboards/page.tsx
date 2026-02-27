import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardsPage() {
  const session = await auth();
  const membership = await prisma.workspaceMember.findFirst({ where: { userId: session!.user.id } });
  if (!membership) return null;

  const [dashboards, tasks, goals] = await Promise.all([
    prisma.dashboard.findMany({ where: { workspaceId: membership.workspaceId } }),
    prisma.task.count({ where: { workspaceId: membership.workspaceId } }),
    prisma.goal.count({ where: { workspaceId: membership.workspaceId } })
  ]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Dashboards</h1>
      <form action="/api/workspaces" method="post" className="mb-4 flex gap-2">
        <input type="hidden" name="action" value="create-dashboard" />
        <input type="hidden" name="workspaceId" value={membership.workspaceId} />
        <input name="title" required placeholder="Dashboard title" className="rounded border px-2 py-2" />
        <button className="rounded bg-brand-700 px-3 py-2 text-white">Create</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {dashboards.map((dashboard) => (
          <div key={dashboard.id} className="rounded border bg-white p-4">
            <h2 className="font-medium">{dashboard.title}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded bg-slate-50 p-2 text-sm">Tasks: {tasks}</div>
              <div className="rounded bg-slate-50 p-2 text-sm">Goals: {goals}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
