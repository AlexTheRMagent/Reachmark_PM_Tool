import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getActiveWorkspaceForUser } from "@/lib/data";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const workspace = await getActiveWorkspaceForUser(session.user.id);
  if (!workspace) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar workspace={workspace} />
      <div className="flex-1">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
