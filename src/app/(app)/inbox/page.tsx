import { auth } from "@/lib/auth";
import { getInbox } from "@/lib/data";

export default async function InboxPage() {
  const session = await auth();
  const items = await getInbox(session!.user.id);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Inbox</h1>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded border border-slate-200 bg-white p-3">
            <div className="text-sm font-medium">{item.type}</div>
            <div className="text-xs text-slate-600">{JSON.stringify(item.payload)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
