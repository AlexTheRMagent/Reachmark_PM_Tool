import { prisma } from "@/lib/prisma";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const [tasks, docs, goals] = await Promise.all([
    query ? prisma.task.findMany({ where: { title: { contains: query, mode: "insensitive" } }, take: 10 }) : [],
    query ? prisma.doc.findMany({ where: { OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }] }, take: 10 }) : [],
    query ? prisma.goal.findMany({ where: { title: { contains: query, mode: "insensitive" } }, take: 10 }) : []
  ]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Search</h1>
      <p className="mb-4 text-sm text-slate-600">Query: {query || "(empty)"}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-3"><h2 className="mb-2 font-medium">Tasks</h2>{tasks.map((t) => <p key={t.id} className="text-sm">{t.title}</p>)}</div>
        <div className="rounded border bg-white p-3"><h2 className="mb-2 font-medium">Docs</h2>{docs.map((d) => <p key={d.id} className="text-sm">{d.title}</p>)}</div>
        <div className="rounded border bg-white p-3"><h2 className="mb-2 font-medium">Goals</h2>{goals.map((g) => <p key={g.id} className="text-sm">{g.title}</p>)}</div>
      </div>
    </div>
  );
}
