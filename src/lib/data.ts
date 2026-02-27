import { prisma } from "@/lib/prisma";

export async function getActiveWorkspaceForUser(userId: string) {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: {
        include: {
          spaces: { include: { folders: { include: { lists: true } }, lists: true } }
        }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  return membership?.workspace ?? null;
}

export async function getInbox(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30
  });
}
