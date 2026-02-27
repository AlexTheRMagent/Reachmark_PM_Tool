import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();
  const me = await prisma.workspaceMember.findFirst({
    where: { userId: session!.user.id },
    include: { workspace: true }
  });
  if (!me) return null;

  const [members, shares] = await Promise.all([
    prisma.workspaceMember.findMany({
      where: { workspaceId: me.workspaceId },
      include: { user: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.sharePermission.findMany({ where: { workspaceId: me.workspaceId }, orderBy: { createdAt: "desc" }, take: 30 })
  ]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Permissions & Sharing</h1>
      <div className="mb-6 rounded border bg-white p-4">
        <h2 className="mb-2 font-medium">Members and Roles</h2>
        {members.map((member) => (
          <p key={member.id} className="text-sm">{member.user.email} - {member.role}</p>
        ))}
      </div>
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-medium">Create Share Permission</h2>
        <form action="/api/workspaces" method="post" className="grid grid-cols-5 gap-2">
          <input type="hidden" name="action" value="create-share" />
          <input type="hidden" name="workspaceId" value={me.workspaceId} />
          <select name="entityType" className="rounded border px-2 py-2">
            <option>TASK</option>
            <option>LIST</option>
            <option>DOC</option>
            <option>DASHBOARD</option>
          </select>
          <input name="entityId" placeholder="Entity ID" className="rounded border px-2 py-2" required />
          <input name="userId" placeholder="User ID" className="rounded border px-2 py-2" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="canEdit" /> Can edit</label>
          <button className="rounded bg-brand-700 px-3 py-2 text-white">Share</button>
        </form>
        <div className="mt-3 space-y-1 text-xs text-slate-600">
          {shares.map((share) => (
            <p key={share.id}>{share.entityType}/{share.entityId} - view:{String(share.canView)} edit:{String(share.canEdit)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
