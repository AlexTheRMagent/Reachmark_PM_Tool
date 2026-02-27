import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DocsPage() {
  const session = await auth();
  const membership = await prisma.workspaceMember.findFirst({ where: { userId: session!.user.id } });
  if (!membership) return null;

  const docs = await prisma.doc.findMany({ where: { workspaceId: membership.workspaceId }, orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Docs</h1>
      <form action="/api/workspaces" method="post" className="mb-4 flex gap-2">
        <input type="hidden" name="action" value="create-doc" />
        <input type="hidden" name="workspaceId" value={membership.workspaceId} />
        <input name="title" required placeholder="Doc title" className="w-80 rounded border border-slate-300 px-3 py-2" />
        <button className="rounded bg-brand-700 px-3 py-2 text-white">New Doc</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {docs.map((doc) => (
          <form key={doc.id} action="/api/workspaces" method="post" className="rounded border bg-white p-3">
            <input type="hidden" name="action" value="update-doc" />
            <input type="hidden" name="docId" value={doc.id} />
            <input name="title" defaultValue={doc.title} className="mb-2 w-full rounded border px-2 py-1" />
            <textarea name="content" defaultValue={doc.content} className="h-36 w-full rounded border px-2 py-1" />
            <button className="mt-2 rounded bg-slate-900 px-3 py-1 text-sm text-white">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
