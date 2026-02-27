import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function FolderPage({ params }: { params: Promise<{ folderId: string }> }) {
  const { folderId } = await params;
  const folder = await prisma.folder.findUnique({ where: { id: folderId }, include: { lists: true } });
  if (!folder) return <div>Folder not found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Folder: {folder.name}</h1>
      <div className="mt-4 space-y-2">
        {folder.lists.map((list) => (
          <Link key={list.id} href={`/lists/${list.id}`} className="block rounded border bg-white p-3 text-sm hover:bg-slate-50">
            {list.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
