import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";
import { todayJalali } from "@/lib/utils";
import type { CaseStatus, CaseType } from "@/lib/types";

type Search = { clientId?: string };

export const Route = createFileRoute("/cases/new")({
  component: NewCase,
  validateSearch: (s: Record<string, unknown>): Search => ({
    clientId: typeof s.clientId === "string" ? s.clientId : undefined,
  }),
});

function NewCase() {
  const { clientId: preset } = Route.useSearch();
  const clients = useApp((s) => s.clients);
  const addCase = useApp((s) => s.addCase);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(preset ?? "");
  const [caseType, setCaseType] = useState<CaseType>("civil");
  const [court, setCourt] = useState("");
  const [branch, setBranch] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CaseStatus>("active");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId) return;
    const id = addCase({
      title,
      clientId,
      caseType,
      court,
      branch,
      caseNumber,
      courtNumber: caseNumber,
      claimAmount,
      description,
      status,
      openedAt: todayJalali(),
    });
    navigate({ to: "/cases/$id", params: { id } });
  };

  return (
    <AppShell>
      <Link to="/cases" className="mb-3 inline-block text-sm text-muted hover:text-navy">
        بازگشت
      </Link>
      <h1 className="mb-5 text-2xl font-semibold text-navy">تشکیل پرونده جدید</h1>
      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-lg border border-line bg-surface p-5">
        <label className="block text-sm font-medium">
          عنوان *
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block text-sm font-medium">
          موکل *
          <select
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
          >
            <option value="">انتخاب کنید</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            نوع
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value as CaseType)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
            >
              <option value="civil">حقوقی</option>
              <option value="criminal">کیفری</option>
              <option value="family">خانواده</option>
              <option value="commercial">تجاری</option>
              <option value="administrative">اداری</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            وضعیت
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
            >
              <option value="active">فعال</option>
              <option value="draft">پیش‌نویس</option>
              <option value="closed">مختومه</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          کلاسه
          <input
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          مرجع قضایی
          <input
            value={court}
            onChange={(e) => setCourt(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          شعبه
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          ارزش خواسته (ریال)
          <input
            dir="ltr"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          شرح
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 min-h-24 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm"
          />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="h-11 rounded-md bg-navy px-5 text-sm font-medium text-paper">
            ثبت پرونده
          </button>
          <Link to="/cases" className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm">
            انصراف
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
