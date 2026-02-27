import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function GoalsPage() {
  const session = await auth();
  const membership = await prisma.workspaceMember.findFirst({ where: { userId: session!.user.id } });
  if (!membership) return null;

  const goals = await prisma.goal.findMany({ where: { workspaceId: membership.workspaceId }, orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Goals</h1>
      <form action="/api/workspaces" method="post" className="mb-4 grid grid-cols-4 gap-2">
        <input type="hidden" name="action" value="create-goal" />
        <input type="hidden" name="workspaceId" value={membership.workspaceId} />
        <input name="title" required placeholder="Goal title" className="rounded border px-2 py-2" />
        <input name="targetValue" required type="number" step="0.1" placeholder="Target" className="rounded border px-2 py-2" />
        <input name="currentValue" required type="number" step="0.1" placeholder="Current" className="rounded border px-2 py-2" />
        <button className="rounded bg-brand-700 px-3 py-2 text-white">Create Goal</button>
      </form>
      <div className="space-y-2">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
          return (
            <div key={goal.id} className="rounded border bg-white p-3">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{goal.title}</h2>
                <span className="text-sm">{progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded bg-slate-100">
                <div className="h-2 rounded bg-brand-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
