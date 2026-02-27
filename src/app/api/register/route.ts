import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const email = "demo@reachmark.dev";
    const password = "demo1234";
    const passwordHash = await bcrypt.hash(password, 10);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Demo User",
          passwordHash
        }
      });
    }

    const workspace = await prisma.workspace.upsert({
      where: { id: "demo-workspace" },
      update: {},
      create: {
        id: "demo-workspace",
        name: "Reachmark Demo Workspace",
        ownerId: user.id
      }
    });

    await prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
      update: {},
      create: { workspaceId: workspace.id, userId: user.id, role: "OWNER" }
    });

    return NextResponse.json({ message: "Demo user ready", email, password });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    return NextResponse.json(
      { message: "Seed failed", code: err?.code ?? "UNKNOWN", error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
