import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitRealtime } from "@/lib/realtime";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const taskId = String(formData.get("taskId"));
  const body = String(formData.get("body"));

  const comment = await prisma.comment.create({
    data: { taskId, body, authorId: session.user.id }
  });

  const members = await prisma.workspaceMember.findMany({
    where: {
      workspace: {
        spaces: {
          some: {
            lists: {
              some: {
                tasks: {
                  some: { taskId }
                }
              }
            }
          }
        }
      }
    }
  });

  if (members.length) {
    await prisma.notification.createMany({
      data: members
        .filter((m) => m.userId !== session.user.id)
        .map((m) => ({
          userId: m.userId,
          type: "task_comment",
          payload: { taskId, body }
        }))
    });
  }

  await emitRealtime("comment:created", { taskId, body: comment.body });
  return NextResponse.redirect(new URL(req.headers.get("referer") || `/tasks/${taskId}`, req.url));
}
