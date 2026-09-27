import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { legalLibrary, sourceKindLabel } from "@/lib/legal-library";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function LibraryPage() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const list = useMemo(
    () =>
      legalLibrary.filter((s) => {
        const hit = !q || s.title.includes(q) || s.article.includes(q) || s.summary.includes(q);
        return hit && (kind === "all" || s.kind === kind);
      }),
    [q, kind],
  );

  return (
    <AppShell>
      <PageHeader title="منابع حقوقی" subtitle="مواد، آیین دادرسی و آرای وحدت رویه مورد استناد دفتر" />
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجو در عنوان، ماده یا متن"
          className="h-11 min-w-48 flex-1 rounded-md border border-line bg-surface px-3 text-sm"
        />
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="h-11 rounded-md border border-line bg-surface px-3 text-sm">
          <option value="all">همه انواع</option>
          <option value="law">قانون</option>
          <option value="procedure">آیین دادرسی</option>
          <option value="unity">وحدت رویه</option>
          <option value="opinion">نظامات</option>
        </select>
      </div>
      <div className="space-y-3">
        {list.map((s) => (
          <article key={s.id} className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-navy">{s.title}</h2>
              <span className="rounded-full bg-paper px-2 py-0.5 text-xs text-muted">{sourceKindLabel[s.kind]}</span>
            </div>
            <p className="text-sm text-brass">{s.article}</p>
            <p className="mt-2 text-sm leading-7">{s.summary}</p>
            <p className="mt-2 text-xs text-muted">{s.citation}</p>
          </article>
        ))}
        {list.length === 0 && <p className="p-8 text-center text-sm text-muted">منبعی یافت نشد.</p>}
      </div>
    </AppShell>
  );
}
