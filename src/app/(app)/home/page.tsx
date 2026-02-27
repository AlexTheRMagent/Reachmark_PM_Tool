import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ViewSwitcher } from "@/components/features/view-switcher";
import { TaskTable } from "@/components/features/task-table";

export default async function HomePage() {
  const session = await auth();
  const membership = await prisma.workspaceMember.findFirst({ where: { userId: session!.user.id } });
  const tasks = membership
    ? await prisma.task.findMany({
        where: { workspaceId: membership.workspaceId },
        include: { status: true },
        orderBy: { updatedAt: "desc" },
        take: 40
      })
    : [];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Home</h1>
      <p className="mb-4 text-sm text-slate-600">Personal overview and core task views.</p>
      <ViewSwitcher />
      <TaskTable tasks={tasks} />
    </div>
  );
}
