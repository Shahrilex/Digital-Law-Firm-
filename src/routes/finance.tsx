import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { txLabel } from "@/lib/seed";
import { useApp } from "@/lib/store";
import { todayJalali, toFaDigits } from "@/lib/utils";
import type { TxType } from "@/lib/types";

export const Route = createFileRoute("/finance")({ component: FinancePage });

function FinancePage() {
  const txs = useApp((s) => s.transactions);
  const cases = useApp((s) => s.cases);
  const addTransaction = useApp((s) => s.addTransaction);
  const income = txs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const trust = txs
    .filter((t) => t.type === "trust_in")
    .reduce((a, t) => a + t.amount, 0) -
    txs.filter((t) => t.type === "trust_out").reduce((a, t) => a + t.amount, 0);
  const stamp = txs.filter((t) => t.type === "stamp").reduce((a, t) => a + t.amount, 0);
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "");
  const [type, setType] = useState<TxType>("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-navy">امور مالی</h1>
        <p className="text-sm text-muted">حق‌الوکاله، وجوه امانی و تمبر ماده ۱۰۳</p>
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card label="حق‌الوکاله وصول‌شده" value={income} />
        <Card label="مانده وجوه امانی" value={trust} />
        <Card label="تمبر ماده ۱۰۳" value={stamp} />
      </div>
      <form
        className="mb-6 grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(amount.replace(/,/g, ""));
          if (!n || !caseId) return;
          addTransaction({
            caseId,
            type,
            amount: n,
            description: description || txLabel[type],
            date: todayJalali(),
            isTrust: type === "trust_in" || type === "trust_out",
          });
          setAmount("");
          setDescription("");
        }}
      >
        <select
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          className="h-11 rounded-md border border-line bg-paper px-3 text-sm"
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TxType)}
          className="h-11 rounded-md border border-line bg-paper px-3 text-sm"
        >
          <option value="income">حق‌الوکاله</option>
          <option value="trust_in">واریز امانی</option>
          <option value="trust_out">برداشت امانی</option>
          <option value="stamp">تمبر ۱۰۳</option>
          <option value="expense">هزینه</option>
        </select>
        <input
          dir="ltr"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="مبلغ ریال"
          className="h-11 rounded-md border border-line bg-paper px-3 text-sm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="شرح"
          className="h-11 rounded-md border border-line bg-paper px-3 text-sm"
        />
        <button className="h-11 rounded-md bg-navy text-sm font-medium text-paper">ثبت تراکنش</button>
      </form>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 text-right font-medium">تاریخ</th>
              <th className="px-4 py-3 text-right font-medium">پرونده</th>
              <th className="px-4 py-3 text-right font-medium">نوع</th>
              <th className="px-4 py-3 text-right font-medium">شرح</th>
              <th className="px-4 py-3 text-right font-medium">مبلغ</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">{t.date}</td>
                <td className="px-4 py-3">{cases.find((c) => c.id === t.caseId)?.title}</td>
                <td className="px-4 py-3">{txLabel[t.type]}</td>
                <td className="px-4 py-3">{t.description}</td>
                <td className="px-4 py-3 tabular-nums" dir="ltr">
                  {toFaDigits(t.amount.toLocaleString("en-US"))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-navy">
        {toFaDigits(value.toLocaleString("en-US"))}
        <span className="mr-1 text-sm font-normal text-muted">ریال</span>
      </p>
    </div>
  );
}
