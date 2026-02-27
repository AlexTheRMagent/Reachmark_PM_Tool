import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const action = String(formData.get("action") || "");

  if (action === "create-doc") {
    await prisma.doc.create({
      data: {
        workspaceId: String(formData.get("workspaceId")),
        title: String(formData.get("title")),
        content: "",
        createdById: session.user.id
      }
    });
  }

  if (action === "update-doc") {
    await prisma.doc.update({
      where: { id: String(formData.get("docId")) },
      data: {
        title: String(formData.get("title")),
        content: String(formData.get("content"))
      }
    });
  }

  if (action === "create-goal") {
    await prisma.goal.create({
      data: {
        workspaceId: String(formData.get("workspaceId")),
        title: String(formData.get("title")),
        targetValue: Number(formData.get("targetValue")),
        currentValue: Number(formData.get("currentValue"))
      }
    });
  }

  if (action === "create-dashboard") {
    await prisma.dashboard.create({
      data: {
        workspaceId: String(formData.get("workspaceId")),
        title: String(formData.get("title")),
        widgetsJson: [
          { type: "task_count" },
          { type: "goal_progress" }
        ]
      }
    });
  }

  if (action === "create-share") {
    await prisma.sharePermission.create({
      data: {
        workspaceId: String(formData.get("workspaceId")),
        entityType: String(formData.get("entityType")) as
          | "WORKSPACE"
          | "SPACE"
          | "FOLDER"
          | "LIST"
          | "TASK"
          | "DOC"
          | "DASHBOARD"
          | "GOAL",
        entityId: String(formData.get("entityId")),
        userId: String(formData.get("userId") || "") || null,
        canView: true,
        canEdit: Boolean(formData.get("canEdit"))
      }
    });
  }

  return NextResponse.redirect(new URL(req.headers.get("referer") || "/home", req.url));
}
