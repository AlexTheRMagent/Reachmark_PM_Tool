import Link from "next/link";

import { Workspace, Space, Folder, List } from "@prisma/client";

type WorkspaceTree = Workspace & {
  spaces: (Space & { folders: (Folder & { lists: List[] })[]; lists: List[] })[];
};

export function Sidebar({ workspace }: { workspace: WorkspaceTree }) {
  return (
    <aside className="w-80 border-r border-slate-200 bg-white/80 p-4">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
        <h2 className="text-xl font-semibold">{workspace.name}</h2>
      </div>
      <nav className="space-y-3 text-sm">
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/home">Home</Link>
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/inbox">Inbox</Link>
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/docs">Docs</Link>
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/goals">Goals</Link>
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/dashboards">Dashboards</Link>
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/automations">Automations</Link>
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/notifications">Notifications</Link>
        <Link className="block rounded px-2 py-1 hover:bg-slate-100" href="/settings">Settings</Link>
      </nav>
      <div className="mt-6 space-y-4 overflow-y-auto">
        {workspace.spaces.map((space) => (
          <div key={space.id} className="rounded border border-slate-100 p-2">
            <Link href={`/spaces/${space.id}`} className="font-medium text-brand-900">{space.name}</Link>
            <div className="mt-2 space-y-2 pl-2">
              {space.folders.map((folder) => (
                <div key={folder.id}>
                  <Link className="text-slate-700" href={`/folders/${folder.id}`}>{folder.name}</Link>
                  <div className="pl-3">
                    {folder.lists.map((list) => (
                      <Link className="block text-xs text-slate-500" key={list.id} href={`/lists/${list.id}`}>{list.name}</Link>
                    ))}
                  </div>
                </div>
              ))}
              {space.lists.map((list) => (
                <Link className="block text-xs text-slate-500" key={list.id} href={`/lists/${list.id}`}>{list.name}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
