import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/clients")({ component: ClientsPage });

function ClientsPage() {
  const clients = useApp((s) => s.clients);
  const cases = useApp((s) => s.cases);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const list = useMemo(
    () =>
      clients.filter((c) => {
        const hit =
          !q ||
          c.fullName.includes(q) ||
          c.nationalCode.includes(q) ||
          c.mobile.includes(q);
        const t = type === "all" || c.type === type;
        return hit && t;
      }),
    [clients, q, type],
  );

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">موکلین</h1>
          <p className="text-sm text-muted">{list.length} مورد</p>
        </div>
        <Link
          to="/clients/new"
          className="inline-flex h-11 items-center rounded-md bg-navy px-4 text-sm font-medium text-paper"
        >
          موکل جدید
        </Link>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجو نام، کد ملی، موبایل"
          className="h-11 min-w-48 flex-1 rounded-md border border-line bg-surface px-3 text-sm outline-none focus:border-navy"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
        >
          <option value="all">همه انواع</option>
          <option value="individual">حقیقی</option>
          <option value="company">حقوقی</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 text-right font-medium">نام</th>
              <th className="px-4 py-3 text-right font-medium">کد / شناسه</th>
              <th className="px-4 py-3 text-right font-medium">موبایل</th>
              <th className="px-4 py-3 text-right font-medium">نوع</th>
              <th className="px-4 py-3 text-right font-medium">پرونده</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0 hover:bg-paper/70">
                <td className="px-4 py-3">
                  <Link to="/clients/$id" params={{ id: c.id }} className="font-medium text-navy hover:underline">
                    {c.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {c.nationalCode}
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {c.mobile}
                </td>
                <td className="px-4 py-3">{c.type === "individual" ? "حقیقی" : "حقوقی"}</td>
                <td className="px-4 py-3">{cases.filter((x) => x.clientId === c.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-8 text-center text-sm text-muted">موردی یافت نشد.</p>}
      </div>
    </AppShell>
  );
}
