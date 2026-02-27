import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function SpacePage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = await params;
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    include: { folders: { include: { lists: true } }, lists: true }
  });
  if (!space) return <div>Space not found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Space: {space.name}</h1>
      <p className="mt-1 text-sm text-slate-600">Folders and lists in this space.</p>
      <div className="mt-4 space-y-3">
        {space.folders.map((folder) => (
          <div key={folder.id} className="rounded border bg-white p-3">
            <Link className="font-medium text-brand-700" href={`/folders/${folder.id}`}>{folder.name}</Link>
            <div className="mt-2 space-y-1">
              {folder.lists.map((list) => (
                <Link className="block text-sm" key={list.id} href={`/lists/${list.id}`}>{list.name}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
