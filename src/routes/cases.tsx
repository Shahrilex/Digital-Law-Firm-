import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/Badges";
import { caseTypeLabel } from "@/lib/seed";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/cases")({ component: CasesPage });

function CasesPage() {
  const cases = useApp((s) => s.cases);
  const clients = useApp((s) => s.clients);
  const deadlines = useApp((s) => s.deadlines);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");
  const list = useMemo(
    () =>
      cases.filter((c) => {
        const client = clients.find((x) => x.id === c.clientId);
        const hit =
          !q ||
          c.title.includes(q) ||
          c.caseNumber.includes(q) ||
          (client?.fullName ?? "").includes(q);
        return hit && (status === "all" || c.status === status) && (kind === "all" || c.caseType === kind);
      }),
    [cases, clients, q, status, kind],
  );

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">پرونده‌ها</h1>
          <p className="text-sm text-muted">{list.length} پرونده</p>
        </div>
        <Link
          to="/cases/new"
          className="inline-flex h-11 items-center rounded-md bg-navy px-4 text-sm font-medium text-paper"
        >
          تشکیل پرونده
        </Link>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجو عنوان، کلاسه، موکل"
          className="h-11 min-w-48 flex-1 rounded-md border border-line bg-surface px-3 text-sm outline-none focus:border-navy"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="draft">پیش‌نویس</option>
          <option value="closed">مختومه</option>
        </select>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
        >
          <option value="all">همه انواع</option>
          <option value="civil">حقوقی</option>
          <option value="criminal">کیفری</option>
          <option value="family">خانواده</option>
          <option value="commercial">تجاری</option>
          <option value="administrative">اداری</option>
        </select>
      </div>
      <div className="space-y-2">
        {list.map((c) => {
          const client = clients.find((x) => x.id === c.clientId);
          const openD = deadlines.filter((d) => d.caseId === c.id && !d.isCompleted).length;
          return (
            <Link
              key={c.id}
              to="/cases/$id"
              params={{ id: c.id }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4 hover:border-navy/30"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{c.title}</h3>
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-muted">{caseTypeLabel[c.caseType]}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {client?.fullName} · {c.caseNumber || "بدون کلاسه"} · {c.court || "مرجع نامشخص"}
                </p>
              </div>
              {openD > 0 && (
                <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs text-danger">
                  {openD} موعد باز
                </span>
              )}
            </Link>
          );
        })}
        {list.length === 0 && <p className="p-8 text-center text-sm text-muted">پرونده‌ای یافت نشد.</p>}
      </div>
    </AppShell>
  );
}
