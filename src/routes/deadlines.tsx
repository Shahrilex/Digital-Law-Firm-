import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DeadlineBadge } from "@/components/Badges";
import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/deadlines")({ component: DeadlinesPage });

function DeadlinesPage() {
  const deadlines = useApp((s) => s.deadlines);
  const cases = useApp((s) => s.cases);
  const toggle = useApp((s) => s.toggleDeadline);
  const [filter, setFilter] = useState("open");
  const list = useMemo(
    () =>
      deadlines.filter((d) => {
        if (filter === "open") return !d.isCompleted;
        if (filter === "urgent") return d.isUrgent && !d.isCompleted;
        if (filter === "done") return d.isCompleted;
        return true;
      }),
    [deadlines, filter],
  );

  return (
    <AppShell>
      <PageHeader
        title="مواعد"
        subtitle="مهلت‌های قانونی، داخلی و مالی دفتر"
        action={
          <Link to="/tools" className="inline-flex h-11 items-center rounded-md bg-navy px-4 text-sm font-medium text-paper">
            محاسبه موعد
          </Link>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["open", "باز"],
          ["urgent", "فوری"],
          ["done", "انجام‌شده"],
          ["all", "همه"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`h-10 rounded-full px-4 text-sm ${filter === id ? "bg-navy text-paper" : "border border-line bg-surface"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((d) => {
          const c = cases.find((x) => x.id === d.caseId);
          return (
            <div
              key={d.id}
              className={`rounded-xl border bg-surface p-4 ${d.isUrgent && !d.isCompleted ? "border-danger/40" : "border-line"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={`font-medium ${d.isCompleted ? "text-muted line-through" : ""}`}>{d.title}</p>
                  {c && (
                    <Link to="/cases/$id" params={{ id: c.id }} className="text-sm text-brass hover:underline">
                      {c.title}
                    </Link>
                  )}
                  {d.legalArticle && <p className="mt-1 text-xs text-muted">{d.legalArticle}</p>}
                  <div className="mt-2">
                    <DeadlineBadge type={d.type} />
                  </div>
                </div>
                <div className="text-left">
                  <p className={d.isUrgent && !d.isCompleted ? "font-semibold text-danger" : "text-navy"}>{d.dueDate}</p>
                  <button onClick={() => toggle(d.id)} className="mt-2 text-xs text-muted hover:text-navy">
                    {d.isCompleted ? "بازگردانی" : "علامت انجام"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p className="p-8 text-center text-sm text-muted">موعدی در این فهرست نیست.</p>}
      </div>
    </AppShell>
  );
}
