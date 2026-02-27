import Link from "next/link";

import { Task, Status } from "@prisma/client";

type TaskWithStatus = Task & { status: Status | null };

export function TaskTable({ tasks }: { tasks: TaskWithStatus[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left">Task</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Priority</th>
            <th className="px-3 py-2 text-left">Due</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-slate-100">
              <td className="px-3 py-2"><Link href={`/tasks/${task.id}`} className="text-brand-700 hover:underline">{task.title}</Link></td>
              <td className="px-3 py-2">{task.status?.name ?? "No Status"}</td>
              <td className="px-3 py-2">{task.priority}</td>
              <td className="px-3 py-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
