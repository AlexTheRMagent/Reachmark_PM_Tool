import { prisma } from "@/lib/prisma";

export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      status: true,
      assignees: { include: { user: true } },
      comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
      customValues: { include: { customField: true } },
      subtasks: true,
      attachments: true
    }
  });

  if (!task) return <div>Task not found.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{task.title}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded border bg-white p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p>{task.status?.name ?? "No status"}</p>
          <p className="mt-2 text-xs text-slate-500">Priority</p>
          <p>{task.priority}</p>
          <p className="mt-2 text-xs text-slate-500">Description</p>
          <p>{task.description ?? "No description"}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-xs text-slate-500">Assignees</p>
          <ul>{task.assignees.map((a) => <li key={a.id}>{a.user.name ?? a.user.email}</li>)}</ul>
          <p className="mt-2 text-xs text-slate-500">Subtasks</p>
          <ul>{task.subtasks.map((s) => <li key={s.id}>{s.title}</li>)}</ul>
        </div>
      </div>
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-medium">Comments</h2>
        <form action="/api/comments" method="post" className="mb-3 flex gap-2">
          <input type="hidden" name="taskId" value={task.id} />
          <input name="body" required className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Add comment" />
          <button className="rounded bg-brand-700 px-3 py-2 text-white">Post</button>
        </form>
        <div className="space-y-2">
          {task.comments.map((c) => (
            <div key={c.id} className="rounded border border-slate-100 p-2">
              <p className="text-xs text-slate-500">{c.author.name ?? c.author.email}</p>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
