import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@reachmark.dev" },
    update: {},
    create: { email: "demo@reachmark.dev", name: "Demo User", passwordHash }
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: "demo-workspace" },
    update: { ownerId: user.id },
    create: { id: "demo-workspace", name: "Reachmark Demo Workspace", ownerId: user.id }
  });

  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: { role: "OWNER" },
    create: { workspaceId: workspace.id, userId: user.id, role: "OWNER" }
  });

  const statusTodo = await prisma.status.upsert({
    where: { id: "status-todo" },
    update: {},
    create: { id: "status-todo", workspaceId: workspace.id, name: "To Do", color: "#64748b" }
  });
  const statusDoing = await prisma.status.upsert({
    where: { id: "status-doing" },
    update: {},
    create: { id: "status-doing", workspaceId: workspace.id, name: "In Progress", color: "#0284c7" }
  });

  const space = await prisma.space.upsert({
    where: { id: "space-product" },
    update: {},
    create: { id: "space-product", workspaceId: workspace.id, name: "Product" }
  });
  const folder = await prisma.folder.upsert({
    where: { id: "folder-roadmap" },
    update: {},
    create: { id: "folder-roadmap", spaceId: space.id, name: "Roadmap" }
  });
  const list = await prisma.list.upsert({
    where: { id: "list-q1" },
    update: {},
    create: { id: "list-q1", spaceId: space.id, folderId: folder.id, name: "Q1 Delivery" }
  });

  const task = await prisma.task.upsert({
    where: { id: "task-setup" },
    update: {},
    create: {
      id: "task-setup",
      customId: "RM-1001",
      workspaceId: workspace.id,
      title: "Set up product analytics",
      description: "Implement dashboards and events.",
      priority: "HIGH",
      statusId: statusDoing.id
    }
  });

  await prisma.taskList.upsert({
    where: { taskId_listId: { taskId: task.id, listId: list.id } },
    update: {},
    create: { taskId: task.id, listId: list.id }
  });

  await prisma.task.create({
    data: {
      customId: `RM-${Date.now()}`,
      workspaceId: workspace.id,
      title: "Draft onboarding checklist",
      parentTaskId: task.id,
      statusId: statusTodo.id,
      taskLists: { create: { listId: list.id } }
    }
  }).catch(() => null);

  await prisma.doc.upsert({
    where: { id: "doc-sprint-plan" },
    update: {},
    create: { id: "doc-sprint-plan", workspaceId: workspace.id, title: "Sprint Plan", content: "# Sprint Goals\n- Ship MVP", createdById: user.id }
  });

  await prisma.goal.upsert({
    where: { id: "goal-q1" },
    update: {},
    create: { id: "goal-q1", workspaceId: workspace.id, title: "Q1 Activation", targetValue: 1000, currentValue: 340 }
  });

  await prisma.dashboard.upsert({
    where: { id: "dash-exec" },
    update: {},
    create: { id: "dash-exec", workspaceId: workspace.id, title: "Execution Overview", widgetsJson: [{ type: "task_count" }, { type: "goal_progress" }] }
  });

  await prisma.automationRule.upsert({
    where: { id: "auto-overdue" },
    update: {},
    create: { id: "auto-overdue", workspaceId: workspace.id, name: "Overdue Alert", trigger: "due_date_passed", condition: "status != done", action: "notify_assignees" }
  });

  await prisma.notification.create({
    data: { userId: user.id, type: "seed_ready", payload: { message: "Demo workspace seeded" } }
  }).catch(() => null);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
