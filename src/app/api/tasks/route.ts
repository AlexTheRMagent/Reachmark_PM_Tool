import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitRealtime } from "@/lib/realtime";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const workspaceId = String(formData.get("workspaceId"));
  const listId = String(formData.get("listId"));
  const title = String(formData.get("title"));

  const [status] = await Promise.all([
    prisma.status.findFirst({ where: { workspaceId }, orderBy: { createdAt: "asc" } })
  ]);

  const task = await prisma.task.create({
    data: {
      customId: `T-${Date.now()}`,
      workspaceId,
      title,
      statusId: status?.id,
      taskLists: { create: { listId } }
    }
  });

  await prisma.activityLog.create({
    data: {
      workspaceId,
      userId: session.user.id,
      entityType: "TASK",
      entityId: task.id,
      action: "CREATE",
      message: `Task created: ${title}`
    }
  });

  await emitRealtime("task:created", { taskId: task.id, title });

  return NextResponse.redirect(new URL(req.headers.get("referer") || `/tasks/${task.id}`, req.url));
}
