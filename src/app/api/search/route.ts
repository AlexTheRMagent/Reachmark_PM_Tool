import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const [tasks, docs, goals, dashboards] = await Promise.all([
    prisma.task.findMany({ where: { title: { contains: q, mode: "insensitive" } }, take: 5 }),
    prisma.doc.findMany({ where: { title: { contains: q, mode: "insensitive" } }, take: 5 }),
    prisma.goal.findMany({ where: { title: { contains: q, mode: "insensitive" } }, take: 5 }),
    prisma.dashboard.findMany({ where: { title: { contains: q, mode: "insensitive" } }, take: 5 })
  ]);

  return NextResponse.json({ tasks, docs, goals, dashboards });
}
