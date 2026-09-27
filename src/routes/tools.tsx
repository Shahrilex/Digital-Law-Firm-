import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PageHeader";
import { calculateDeadline, deadlineRules } from "@/lib/deadline-engine";
import { courtFee, stampTax } from "@/lib/stamp";
import { money, todayJalali } from "@/lib/utils";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/tools")({ component: ToolsPage });

function ToolsPage() {
  const addDeadline = useApp((s) => s.addDeadline);
  const cases = useApp((s) => s.cases);
  const [ruleCode, setRuleCode] = useState("REV-20");
  const [notice, setNotice] = useState(todayJalali());
  const [abroad, setAbroad] = useState(false);
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "");
  const calc = calculateDeadline({ ruleCode, noticeDate: notice, abroad });

  const [fee, setFee] = useState("80000000");
  const [claim, setClaim] = useState("250000000");
  const stamp = stampTax(Number(fee) || 0);
  const court = courtFee(Number(claim) || 0);

  return (
    <AppShell>
      <PageHeader title="ابزارها" subtitle="محاسبه موعد قانونی و تمبر ماده ۱۰۳" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Surface>
          <h2 className="mb-4 font-semibold text-navy">ماشین‌حساب موعد</h2>
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              قاعده
              <select value={ruleCode} onChange={(e) => setRuleCode(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm">
                {deadlineRules.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              تاریخ مبدأ (ابلاغ)
              <input value={notice} onChange={(e) => setNotice(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm" />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={abroad} onChange={(e) => setAbroad(e.target.checked)} />
              مقیم خارج از کشور (مهلت ۶۰ روز در موارد مشمول)
            </label>
            {calc.ok ? (
              <div className="rounded-md bg-paper p-3">
                <p className="text-lg font-semibold text-navy">سررسید: {calc.dueDate}</p>
                <ol className="mt-2 list-decimal space-y-1 pr-5 text-xs text-muted">
                  {calc.log.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-sm text-danger">{calc.message}</p>
            )}
            <label className="block text-sm font-medium">
              پرونده برای ثبت موعد
              <select value={caseId} onChange={(e) => setCaseId(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm">
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="h-11 rounded-md bg-navy px-4 text-sm text-paper"
              disabled={!calc.ok}
              onClick={() => {
                if (!calc.ok || !calc.dueDate || !calc.rule) return;
                addDeadline({
                  title: calc.rule.title,
                  caseId,
                  dueDate: calc.dueDate,
                  type: "legal",
                  isUrgent: (calc.days ?? 20) <= 10,
                  legalArticle: calc.rule.article,
                  ruleCode: calc.rule.code,
                });
              }}
            >
              ثبت موعد روی پرونده
            </button>
          </div>
        </Surface>
        <Surface>
          <h2 className="mb-4 font-semibold text-navy">تمبر و هزینه دادرسی</h2>
          <label className="block text-sm font-medium">
            حق‌الوکاله (ریال)
            <input dir="ltr" value={fee} onChange={(e) => setFee(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm" />
          </label>
          <p className="mt-3 text-xl font-semibold text-navy">{money(stamp.tax)}</p>
          <p className="mt-1 text-xs text-muted">{stamp.note}</p>
          <label className="mt-5 block text-sm font-medium">
            خواسته دعوا (ریال)
            <input dir="ltr" value={claim} onChange={(e) => setClaim(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm" />
          </label>
          <p className="mt-3 text-xl font-semibold text-navy">{money(court.fee)}</p>
          <p className="mt-1 text-xs text-muted">{court.note}</p>
        </Surface>
      </div>
    </AppShell>
  );
}
