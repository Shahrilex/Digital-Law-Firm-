import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PageHeader";
import { StatusBadge } from "@/components/Badges";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/portal")({ component: PortalPage });

function PortalPage() {
  const clients = useApp((s) => s.clients);
  const cases = useApp((s) => s.cases);
  const hearings = useApp((s) => s.hearings);
  const documents = useApp((s) => s.documents);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const client = clients.find((c) => c.id === clientId);
  const mine = cases.filter((c) => c.clientId === clientId);
  const mineIds = new Set(mine.map((c) => c.id));
  const nextH = hearings.filter((h) => mineIds.has(h.caseId) && !h.result);
  const docs = documents.filter((d) => mineIds.has(d.caseId));

  return (
    <AppShell>
      <PageHeader title="پورتال موکل" subtitle="نمای ساده‌ای که موکل از وضعیت پرونده می‌بیند" />
      <label className="mb-5 block max-w-sm text-sm font-medium">
        مشاهده به عنوان
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm">
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </label>
      <Surface className="mb-4">
        <p className="text-sm text-muted">سلام {client?.fullName}</p>
        <p className="mt-1 text-lg font-semibold text-navy">وضعیت پرونده‌های شما</p>
        <p className="mt-2 text-sm text-muted">اسناد محرمانه داخلی دفتر در این نما نمایش داده نمی‌شود.</p>
      </Surface>
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface>
          <h2 className="mb-3 font-semibold text-navy">پرونده‌ها</h2>
          {mine.map((c) => (
            <div key={c.id} className="mb-2 flex items-center justify-between rounded-md border border-line px-3 py-2">
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-xs text-muted">{c.caseNumber || "در حال ثبت"}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
          {mine.length === 0 && <p className="text-sm text-muted">پرونده‌ای نیست.</p>}
        </Surface>
        <Surface>
          <h2 className="mb-3 font-semibold text-navy">جلسات پیش رو</h2>
          {nextH.map((h) => (
            <p key={h.id} className="mb-2 text-sm">
              {h.date} · {h.time} — {h.subject}
            </p>
          ))}
          {nextH.length === 0 && <p className="text-sm text-muted">جلسه‌ای اعلام نشده.</p>}
        </Surface>
        <Surface className="lg:col-span-2">
          <h2 className="mb-3 font-semibold text-navy">اسناد قابل مشاهده</h2>
          {docs.map((d) => (
            <p key={d.id} className="text-sm">
              {d.title} · {d.kind}
            </p>
          ))}
          {docs.length === 0 && <p className="text-sm text-muted">سندی برای نمایش نیست.</p>}
        </Surface>
      </div>
    </AppShell>
  );
}
