import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PageHeader";
import { findConflicts, lookupCode } from "@/lib/conflict";
import { partyRoleLabel } from "@/lib/seed";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/conflict")({ component: ConflictPage });

function ConflictPage() {
  const clients = useApp((s) => s.clients);
  const parties = useApp((s) => s.parties);
  const cases = useApp((s) => s.cases);
  const hits = findConflicts(clients, parties, cases);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReturnType<typeof lookupCode> | null>(null);

  return (
    <AppShell>
      <PageHeader title="تعارض منافع" subtitle="بررسی کد ملی موکل در برابر طرفین پرونده‌های فعال" />
      <Surface className="mb-5">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setResult(lookupCode(code.trim(), clients, parties, cases));
          }}
        >
          <input
            dir="ltr"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="کد ملی یا شناسه ملی"
            className="h-11 flex-1 rounded-md border border-line bg-paper px-3 text-sm"
          />
          <button className="h-11 rounded-md bg-navy px-5 text-sm text-paper">استعلام</button>
        </form>
        {result && (
          <div className="mt-4 space-y-2 text-sm">
            {result.clients.length === 0 && result.parties.length === 0 && (
              <p className="text-ok">در سوابق دفتر برخوردی یافت نشد.</p>
            )}
            {result.clients.map((c) => (
              <p key={c.id}>
                موکل:{" "}
                <Link to="/clients/$id" params={{ id: c.id }} className="text-brass">
                  {c.fullName}
                </Link>
              </p>
            ))}
            {result.parties.map((p) => (
              <p key={p.id}>
                طرف پرونده «{p.caseTitle}»: {p.fullName} ({partyRoleLabel[p.role]})
              </p>
            ))}
          </div>
        )}
      </Surface>
      <h2 className="mb-3 font-semibold text-navy">موارد شناسایی‌شده</h2>
      <div className="space-y-3">
        {hits.length === 0 && <p className="text-sm text-muted">تعارض بازی ثبت نشده است.</p>}
        {hits.map((h, i) => (
          <div key={`${h.nationalCode}-${i}`} className="rounded-xl border border-danger/30 bg-surface p-4">
            <p className="font-medium text-danger">{h.reason}</p>
            <p className="mt-1 text-sm">
              {h.nameA} و {h.nameB}
              {h.caseTitle ? ` · پرونده ${h.caseTitle}` : ""}
            </p>
            <p className="mt-1 text-xs text-muted" dir="ltr">
              {h.nationalCode}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
