import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AutomationsPage() {
  const session = await auth();
  const membership = await prisma.workspaceMember.findFirst({ where: { userId: session!.user.id } });
  if (!membership) return null;

  const rules = await prisma.automationRule.findMany({ where: { workspaceId: membership.workspaceId }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Automations</h1>
      <form action="/api/automations" method="post" className="mb-4 grid grid-cols-4 gap-2">
        <input type="hidden" name="workspaceId" value={membership.workspaceId} />
        <input name="name" required placeholder="Rule name" className="rounded border px-2 py-2" />
        <input name="trigger" required placeholder="Trigger" className="rounded border px-2 py-2" />
        <input name="condition" required placeholder="Condition" className="rounded border px-2 py-2" />
        <input name="action" required placeholder="Action" className="rounded border px-2 py-2" />
        <button className="col-span-4 rounded bg-brand-700 px-3 py-2 text-white">Create Rule</button>
      </form>
      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded border bg-white p-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{rule.name}</h2>
              <span className="text-xs text-slate-500">{rule.enabled ? "Enabled" : "Disabled"}</span>
            </div>
            <p className="text-sm">When <b>{rule.trigger}</b> and <b>{rule.condition}</b>, then <b>{rule.action}</b>.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
