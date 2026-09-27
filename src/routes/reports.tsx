import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PageHeader";
import { caseTypeLabel, txLabel } from "@/lib/seed";
import { useApp } from "@/lib/store";
import { money, toFaDigits } from "@/lib/utils";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

function ReportsPage() {
  const cases = useApp((s) => s.cases);
  const txs = useApp((s) => s.transactions);
  const deadlines = useApp((s) => s.deadlines);

  const byType = Object.entries(caseTypeLabel).map(([k, label]) => ({
    name: label,
    n: cases.filter((c) => c.caseType === k).length,
  }));
  const byTx = Object.entries(txLabel).map(([k, label]) => ({
    name: label,
    n: txs.filter((t) => t.type === k).reduce((a, t) => a + t.amount, 0) / 1_000_000,
  }));
  const income = txs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const stamp = txs.filter((t) => t.type === "stamp").reduce((a, t) => a + t.amount, 0);
  const openDl = deadlines.filter((d) => !d.isCompleted).length;

  return (
    <AppShell>
      <PageHeader title="گزارش‌ها" subtitle="وضعیت دفتر به تفکیک نوع پرونده و جریان مالی" />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Kpi label="درآمد ثبت‌شده" value={money(income)} />
        <Kpi label="تمبر ابطالی" value={money(stamp)} />
        <Kpi label="موعد باز" value={toFaDigits(openDl)} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Surface>
          <h2 className="mb-4 font-semibold text-navy">پرونده‌ها بر اساس نوع</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType}>
                <CartesianGrid stroke="#ddd6c8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b6458" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b6458" }} />
                <Tooltip />
                <Bar dataKey="n" fill="#0c1e33" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
        <Surface>
          <h2 className="mb-4 font-semibold text-navy">جریان مالی (میلیون ریال)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byTx}>
                <CartesianGrid stroke="#ddd6c8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b6458" }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: "#6b6458" }} />
                <Tooltip />
                <Bar dataKey="n" fill="#8d7344" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-navy">{value}</p>
    </div>
  );
}
