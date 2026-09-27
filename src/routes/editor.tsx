import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { draftPetition } from "@/lib/ai-draft";
import { generateDraft } from "@/lib/generate-draft";
import { useApp } from "@/lib/store";

type Search = { caseId?: string };

export const Route = createFileRoute("/editor")({
  component: EditorPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    caseId: typeof s.caseId === "string" ? s.caseId : undefined,
  }),
});

function EditorPage() {
  const search = Route.useSearch();
  const cases = useApp((s) => s.cases);
  const clients = useApp((s) => s.clients);
  const petitions = useApp((s) => s.petitions);
  const savePetition = useApp((s) => s.savePetition);
  const [caseId, setCaseId] = useState(search.caseId ?? cases[0]?.id ?? "");
  const [kind, setKind] = useState("petition");
  const [title, setTitle] = useState("دادخواست");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");
  const caseItem = cases.find((c) => c.id === caseId);
  const client = clients.find((c) => c.id === caseItem?.clientId);
  const related = useMemo(() => petitions.filter((p) => !caseId || p.caseId === caseId), [petitions, caseId]);

  const titles: Record<string, string> = {
    appeal: "لایحه تجدیدنظرخواهی",
    defense: "لایحه دفاعیه",
    expert: "اعتراض به نظریه کارشناسی",
    execution: "درخواست اجرای حکم",
    settlement: "لایحه سازش",
    petition: "دادخواست",
  };

  const generate = async () => {
    setBusy(true);
    setHint("");
    setTitle(titles[kind] ?? "دادخواست");
    const facts = [
      `موکل: ${client?.fullName ?? "نامشخص"}`,
      `موضوع: ${caseItem?.title ?? ""}`,
      `مرجع: ${caseItem?.court ?? ""} ${caseItem?.branch ?? ""}`,
      `کلاسه: ${caseItem?.caseNumber ?? "—"}`,
      `خواسته: ${caseItem?.claimAmount ?? ""}`,
      `شرح: ${caseItem?.description ?? ""}`,
    ].join("\n");
    try {
      const res = await generateDraft({ data: { kind, facts } });
      if (res.ok) {
        setBody(res.text);
        setHint("متن با مدل هوشمند تولید شد؛ پیش از تقدیم بازبینی کنید.");
      } else {
        setBody(draftPetition(kind, caseItem, client));
        setHint("الگوی حقوقی دفتر اعمال شد (اتصال مدل در این محیط در دسترس نبود).");
      }
    } catch {
      setBody(draftPetition(kind, caseItem, client));
      setHint("الگوی حقوقی دفتر اعمال شد.");
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    const id = savePetition({ caseId, title, body });
    setSaved(id);
  };

  return (
    <AppShell>
      <PageHeader title="ویرایشگر لایحه" subtitle="پیش‌نویس اوراق قضایی با استناد به مواد قانونی" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="space-y-3 rounded-xl border border-line bg-surface p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">
              پرونده
              <select
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              نوع سند
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
              >
                <option value="petition">دادخواست</option>
                <option value="defense">لایحه دفاعیه</option>
                <option value="appeal">تجدیدنظرخواهی</option>
                <option value="expert">اعتراض کارشناسی</option>
                <option value="execution">اجرای حکم</option>
                <option value="settlement">سازش</option>
              </select>
            </label>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-80 w-full rounded-md border border-line bg-paper p-3 text-sm leading-7 outline-none focus:border-navy"
            placeholder="متن لایحه را بنویسید یا از تولید هوشمند استفاده کنید..."
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={generate}
              disabled={busy}
              className="h-11 rounded-md bg-navy px-4 text-sm font-medium text-paper disabled:opacity-60"
            >
              {busy ? "در حال نگارش..." : "تولید پیش‌نویس هوشمند"}
            </button>
            <button type="button" onClick={save} className="h-11 rounded-md border border-line px-4 text-sm">
              ذخیره در پرونده
            </button>
          </div>
          {hint && <p className="text-sm text-muted">{hint}</p>}
          {saved && <p className="text-sm text-ok">پیش‌نویس ذخیره شد.</p>}
          <p className="text-xs text-muted">این پیشنهاد جایگزین نظر وکیل نیست و باید پیش از تقدیم بازبینی شود.</p>
        </div>
        <aside className="rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-navy">پیش‌نویس‌های پرونده</h2>
          <div className="space-y-2">
            {related.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setTitle(p.title);
                  setBody(p.body);
                  setCaseId(p.caseId);
                }}
                className="block w-full rounded-md border border-line p-3 text-right text-sm hover:bg-paper"
              >
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted">{p.updatedAt}</p>
              </button>
            ))}
            {related.length === 0 && <p className="text-xs text-muted">هنوز پیش‌نویسی نیست.</p>}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
