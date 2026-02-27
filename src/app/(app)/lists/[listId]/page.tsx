import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskTable } from "@/components/features/task-table";

export default async function ListPage({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) return <div>List not found.</div>;

  const taskLists = await prisma.taskList.findMany({
    where: { listId },
    include: { task: { include: { status: true } } },
    orderBy: { task: { updatedAt: "desc" } }
  });

  const session = await auth();
  const member = await prisma.workspaceMember.findFirst({ where: { userId: session!.user.id } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">List: {list.name}</h1>
      <form action="/api/tasks" method="post" className="my-4 flex gap-2">
        <input type="hidden" name="listId" value={listId} />
        <input type="hidden" name="workspaceId" value={member?.workspaceId ?? ""} />
        <input name="title" required className="w-full rounded border border-slate-300 px-3 py-2" placeholder="New task title" />
        <button className="rounded bg-brand-700 px-3 py-2 text-white">Create</button>
      </form>
      <TaskTable tasks={taskLists.map((tl) => tl.task)} />
    </div>
  );
}
