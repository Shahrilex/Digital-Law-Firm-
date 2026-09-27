import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/Badges";
import { PageHeader, Surface } from "@/components/PageHeader";
import { useApp } from "@/lib/store";
import { money, toFaDigits } from "@/lib/utils";
import { findConflicts } from "@/lib/conflict";
import { formatJ, todayJ } from "@/lib/jalali";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const cases = useApp((s) => s.cases);
  const clients = useApp((s) => s.clients);
  const deadlines = useApp((s) => s.deadlines);
  const hearings = useApp((s) => s.hearings);
  const parties = useApp((s) => s.parties);
  const txs = useApp((s) => s.transactions);
  const active = cases.filter((c) => c.status === "active").length;
  const urgent = deadlines.filter((d) => d.isUrgent && !d.isCompleted).length;
  const income = txs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const trust =
    txs.filter((t) => t.type === "trust_in").reduce((a, t) => a + t.amount, 0) -
    txs.filter((t) => t.type === "trust_out").reduce((a, t) => a + t.amount, 0);
  const conflicts = findConflicts(clients, parties, cases);
  const today = formatJ(todayJ());
  const upcomingHearings = hearings.filter((h) => !h.result).slice(0, 3);

  return (
    <AppShell>
      <PageHeader title="داشبورد" subtitle={`نمای کلی دفتر · امروز ${today}`} />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="پرونده فعال" value={toFaDigits(active)} to="/cases" />
        <Stat label="موعد فوری" value={toFaDigits(urgent)} to="/deadlines" warn={urgent > 0} />
        <Stat label="موکلین" value={toFaDigits(clients.length)} to="/clients" />
        <Stat label="حق‌الوکاله" value={money(income)} to="/finance" />
      </div>
      {conflicts.length > 0 && (
        <Link
          to="/conflict"
          className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4"
        >
          <div>
            <p className="font-medium text-danger">هشدار تعارض منافع</p>
            <p className="text-sm text-muted">
              {toFaDigits(conflicts.length)} مورد شناسایی شد. پیش از پذیرش پرونده جدید بررسی کنید.
            </p>
          </div>
          <span className="text-sm text-brass">مشاهده</span>
        </Link>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy">آخرین پرونده‌ها</h2>
            <Link to="/cases" className="text-sm text-brass hover:underline">
              همه
            </Link>
          </div>
          <div className="space-y-2">
            {cases.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to="/cases/$id"
                params={{ id: c.id }}
                className="flex items-center justify-between rounded-md border border-line px-3 py-3 hover:bg-paper"
              >
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted">{c.caseNumber}</p>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        </Surface>
        <Surface>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy">مواعد نزدیک</h2>
            <Link to="/deadlines" className="text-sm text-brass hover:underline">
              همه
            </Link>
          </div>
          <div className="space-y-2">
            {deadlines
              .filter((d) => !d.isCompleted)
              .slice(0, 5)
              .map((d) => {
                const c = cases.find((x) => x.id === d.caseId);
                return (
                  <div key={d.id} className="rounded-md border border-line px-3 py-3">
                    <div className="flex justify-between gap-3">
                      <p className="font-medium">{d.title}</p>
                      <p className={d.isUrgent ? "text-sm text-danger" : "text-sm text-muted"}>{d.dueDate}</p>
                    </div>
                    <p className="text-xs text-muted">{c?.title}</p>
                    {d.legalArticle && <p className="mt-1 text-xs text-muted">{d.legalArticle}</p>}
                  </div>
                );
              })}
          </div>
        </Surface>
        <Surface>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy">جلسات دادگاه</h2>
            <Link to="/calendar" className="text-sm text-brass hover:underline">
              تقویم
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingHearings.map((h) => (
              <div key={h.id} className="rounded-md border border-line px-3 py-3">
                <p className="font-medium">{h.subject}</p>
                <p className="text-xs text-muted">
                  {h.date} · {h.time} · {h.branch}
                </p>
              </div>
            ))}
            {upcomingHearings.length === 0 && <p className="text-sm text-muted">جلسه‌ای در راه نیست.</p>}
          </div>
        </Surface>
        <Surface>
          <h2 className="mb-4 font-semibold text-navy">وجوه امانی</h2>
          <p className="text-2xl font-semibold tabular-nums text-navy">{money(trust)}</p>
          <p className="mt-2 text-sm text-muted">
            وجوه موکل جدا از حساب دفتر نگهداری می‌شود. برداشت فقط با دستور موکل.
          </p>
          <Link to="/finance" className="mt-3 inline-block text-sm text-brass hover:underline">
            دفتر مالی
          </Link>
        </Surface>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  to,
  warn,
}: {
  label: string;
  value: string;
  to: "/cases" | "/deadlines" | "/clients" | "/finance";
  warn?: boolean;
}) {
  return (
    <Link to={to} className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-navy/30">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${warn ? "text-danger" : "text-navy"}`}>{value}</p>
    </Link>
  );
}
