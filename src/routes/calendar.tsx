import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PageHeader";
import { formatJ, holidayLabel, isWeekendOrHoliday, jKey, jalaliMonths, monthGrid, shiftMonth, todayJ, weekDays } from "@/lib/jalali";
import { parseJalali } from "@/lib/jalali";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

function CalendarPage() {
  const now = todayJ();
  const [y, setY] = useState(now.y);
  const [m, setM] = useState(now.m);
  const [selected, setSelected] = useState(now);
  const deadlines = useApp((s) => s.deadlines);
  const hearings = useApp((s) => s.hearings);
  const cases = useApp((s) => s.cases);
  const addHearing = useApp((s) => s.addHearing);
  const [subject, setSubject] = useState("");
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "");
  const [time, setTime] = useState("10:00");

  const cells = useMemo(() => monthGrid(y, m), [y, m]);
  const marks = useMemo(() => {
    const map = new Map<string, { d: number; h: number }>();
    for (const d of deadlines) {
      const p = parseJalali(d.dueDate);
      if (!p) continue;
      const k = jKey(p);
      const cur = map.get(k) ?? { d: 0, h: 0 };
      cur.d += 1;
      map.set(k, cur);
    }
    for (const h of hearings) {
      const p = parseJalali(h.date);
      if (!p) continue;
      const k = jKey(p);
      const cur = map.get(k) ?? { d: 0, h: 0 };
      cur.h += 1;
      map.set(k, cur);
    }
    return map;
  }, [deadlines, hearings]);

  const dayDeadlines = deadlines.filter((d) => {
    const p = parseJalali(d.dueDate);
    return p && jKey(p) === jKey(selected);
  });
  const dayHearings = hearings.filter((h) => {
    const p = parseJalali(h.date);
    return p && jKey(p) === jKey(selected);
  });

  return (
    <AppShell>
      <PageHeader title="تقویم جلالی" subtitle="جلسات دادگاه و مواعد روی ماه شمسی" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Surface>
          <div className="mb-4 flex items-center justify-between">
            <button
              className="h-11 rounded-md border border-line px-3 text-sm"
              onClick={() => {
                const n = shiftMonth(y, m, -1);
                setY(n.y);
                setM(n.m);
              }}
            >
              ماه قبل
            </button>
            <h2 className="font-semibold text-navy">
              {jalaliMonths[m - 1]} {y}
            </h2>
            <button
              className="h-11 rounded-md border border-line px-3 text-sm"
              onClick={() => {
                const n = shiftMonth(y, m, 1);
                setY(n.y);
                setM(n.m);
              }}
            >
              ماه بعد
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {weekDays.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
            {cells.map((c, i) => {
              if (!c) return <div key={i} />;
              const k = jKey(c);
              const mark = marks.get(k);
              const sel = jKey(selected) === k;
              const today = jKey(now) === k;
              const hol = isWeekendOrHoliday(c);
              return (
                <button
                  key={k}
                  onClick={() => setSelected(c)}
                  className={cn(
                    "flex min-h-14 flex-col items-center rounded-md p-1 text-sm",
                    hol && "text-danger",
                    sel && "bg-navy text-paper",
                    !sel && today && "border border-brass",
                    !sel && !today && "hover:bg-paper",
                  )}
                >
                  <span>{c.d}</span>
                  <span className="mt-auto flex gap-0.5">
                    {mark?.d ? <i className={cn("size-1.5 rounded-full", sel ? "bg-brass-soft" : "bg-danger")} /> : null}
                    {mark?.h ? <i className={cn("size-1.5 rounded-full", sel ? "bg-paper" : "bg-brass")} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </Surface>
        <div className="space-y-4">
          <Surface>
            <h3 className="mb-2 font-semibold text-navy">{formatJ(selected)}</h3>
            {holidayLabel(selected) && <p className="mb-2 text-xs text-danger">{holidayLabel(selected)}</p>}
            {dayHearings.map((h) => (
              <div key={h.id} className="mb-2 rounded-md border border-line p-2 text-sm">
                <p className="font-medium">{h.subject}</p>
                <p className="text-xs text-muted">
                  {h.time} · {h.branch}
                </p>
              </div>
            ))}
            {dayDeadlines.map((d) => {
              const cse = cases.find((c) => c.id === d.caseId);
              return (
                <div key={d.id} className="mb-2 rounded-md border border-line p-2 text-sm">
                  <p className="font-medium">{d.title}</p>
                  {cse && (
                    <Link to="/cases/$id" params={{ id: cse.id }} className="text-xs text-brass">
                      {cse.title}
                    </Link>
                  )}
                </div>
              );
            })}
            {dayHearings.length === 0 && dayDeadlines.length === 0 && (
              <p className="text-sm text-muted">رویدادی در این روز نیست.</p>
            )}
          </Surface>
          <Surface>
            <h3 className="mb-3 text-sm font-semibold text-navy">ثبت جلسه</h3>
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!subject.trim() || !caseId) return;
                const cse = cases.find((c) => c.id === caseId);
                addHearing({
                  caseId,
                  date: formatJ(selected),
                  time,
                  court: cse?.court ?? "",
                  branch: cse?.branch ?? "",
                  subject,
                  result: "",
                });
                setSubject("");
              }}
            >
              <select value={caseId} onChange={(e) => setCaseId(e.target.value)} className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm">
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="موضوع جلسه" className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm" />
              <input dir="ltr" value={time} onChange={(e) => setTime(e.target.value)} className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm" />
              <button className="h-11 w-full rounded-md bg-navy text-sm text-paper">ثبت روی این روز</button>
            </form>
          </Surface>
        </div>
      </div>
    </AppShell>
  );
}
