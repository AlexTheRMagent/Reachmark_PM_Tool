import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitRealtime } from "@/lib/realtime";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const rule = await prisma.automationRule.create({
    data: {
      workspaceId: String(formData.get("workspaceId")),
      name: String(formData.get("name")),
      trigger: String(formData.get("trigger")),
      condition: String(formData.get("condition")),
      action: String(formData.get("action"))
    }
  });

  await emitRealtime("automation:created", { ruleId: rule.id, name: rule.name });

  return NextResponse.redirect(new URL(req.headers.get("referer") || "/automations", req.url));
}
