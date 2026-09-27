import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DeadlineBadge, StatusBadge } from "@/components/Badges";
import { caseTypeLabel, partyRoleLabel, txLabel } from "@/lib/seed";
import { useApp } from "@/lib/store";
import { draftPetition } from "@/lib/ai-draft";
import { money } from "@/lib/utils";
import type { PartyRole } from "@/lib/types";

export const Route = createFileRoute("/cases/$id")({ component: CaseDetail });

type Tab = "summary" | "parties" | "timeline" | "docs" | "deadlines" | "finance" | "notes" | "ai";

function CaseDetail() {
  const { id } = Route.useParams();
  const caseItem = useApp((s) => s.cases.find((c) => c.id === id));
  const client = useApp((s) => s.clients.find((c) => c.id === caseItem?.clientId));
  const deadlines = useApp((s) => s.deadlines.filter((d) => d.caseId === id));
  const timeline = useApp((s) => s.timeline.filter((t) => t.caseId === id));
  const documents = useApp((s) => s.documents.filter((d) => d.caseId === id));
  const notes = useApp((s) => s.notes.filter((n) => n.caseId === id));
  const parties = useApp((s) => s.parties.filter((p) => p.caseId === id));
  const txs = useApp((s) => s.transactions.filter((t) => t.caseId === id));
  const hearings = useApp((s) => s.hearings.filter((h) => h.caseId === id));
  const addNote = useApp((s) => s.addNote);
  const addTimeline = useApp((s) => s.addTimeline);
  const addDocument = useApp((s) => s.addDocument);
  const addDeadline = useApp((s) => s.addDeadline);
  const toggleDeadline = useApp((s) => s.toggleDeadline);
  const addParty = useApp((s) => s.addParty);
  const addTransaction = useApp((s) => s.addTransaction);
  const savePetition = useApp((s) => s.savePetition);
  const [tab, setTab] = useState<Tab>("summary");
  const [note, setNote] = useState("");
  const [action, setAction] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [dlTitle, setDlTitle] = useState("");
  const [dlDate, setDlDate] = useState("");
  const [pName, setPName] = useState("");
  const [pCode, setPCode] = useState("");
  const [pRole, setPRole] = useState<PartyRole>("opponent");
  const [draft, setDraft] = useState("");

  if (!caseItem) {
    return (
      <AppShell>
        <p className="text-muted">پرونده یافت نشد.</p>
        <Link to="/cases" className="text-sm text-brass">
          بازگشت
        </Link>
      </AppShell>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "خلاصه" },
    { id: "parties", label: "طرفین" },
    { id: "timeline", label: "تایم‌لاین" },
    { id: "docs", label: "اسناد" },
    { id: "deadlines", label: "مواعد" },
    { id: "finance", label: "مالی" },
    { id: "notes", label: "یادداشت" },
    { id: "ai", label: "هوش مصنوعی" },
  ];

  const claim = Number(caseItem.claimAmount) || 0;

  return (
    <AppShell>
      <Link to="/cases" className="mb-3 inline-block text-sm text-muted hover:text-navy">
        بازگشت به پرونده‌ها
      </Link>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-navy">{caseItem.title}</h1>
            <StatusBadge status={caseItem.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {caseItem.caseNumber || "بدون کلاسه"} · {caseItem.court || "—"} {caseItem.branch && `· ${caseItem.branch}`} ·{" "}
            {caseTypeLabel[caseItem.caseType]}
          </p>
        </div>
        <Link
          to="/editor"
          search={{ caseId: caseItem.id }}
          className="inline-flex h-11 items-center rounded-md bg-navy px-4 text-sm font-medium text-paper"
        >
          نوشتن لایحه
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`h-11 shrink-0 px-4 text-sm ${tab === t.id ? "border-b-2 border-navy font-medium text-navy" : "text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {client ? (
              <Link
                to="/clients/$id"
                params={{ id: client.id }}
                className="rounded-xl border border-line bg-surface p-4 hover:border-navy/30"
              >
                <p className="text-xs text-muted">موکل</p>
                <p className="mt-1 font-medium">{client.fullName}</p>
              </Link>
            ) : (
              <Mini label="موکل" value="—" />
            )}
            <Mini label="تاریخ تشکیل" value={caseItem.openedAt} />
            <Mini label="خواسته" value={claim ? money(claim) : "غیرمالی / نامشخص"} />
            <Mini label="مواعد باز" value={String(deadlines.filter((d) => !d.isCompleted).length)} />
          </div>
          {caseItem.description && (
            <p className="rounded-xl border border-line bg-surface p-4 text-sm leading-7">{caseItem.description}</p>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-4">
              <h3 className="mb-2 text-sm font-semibold text-navy">جلسات</h3>
              {hearings.length === 0 && <p className="text-sm text-muted">جلسه‌ای ثبت نشده.</p>}
              {hearings.map((h) => (
                <p key={h.id} className="text-sm">
                  {h.date} · {h.time} — {h.subject}
                </p>
              ))}
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <h3 className="mb-2 text-sm font-semibold text-navy">طرفین</h3>
              {parties.slice(0, 4).map((p) => (
                <p key={p.id} className="text-sm">
                  {p.fullName} · {partyRoleLabel[p.role]}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "parties" && (
        <section>
          <form
            className="mb-4 grid gap-2 sm:grid-cols-[1fr_8rem_10rem_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!pName.trim()) return;
              addParty({ caseId: id, fullName: pName, nationalCode: pCode, role: pRole, notes: "" });
              setPName("");
              setPCode("");
            }}
          >
            <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="نام" className="h-11 rounded-md border border-line bg-surface px-3 text-sm" />
            <input dir="ltr" value={pCode} onChange={(e) => setPCode(e.target.value)} placeholder="کد ملی" className="h-11 rounded-md border border-line bg-surface px-3 text-sm" />
            <select value={pRole} onChange={(e) => setPRole(e.target.value as PartyRole)} className="h-11 rounded-md border border-line bg-surface px-3 text-sm">
              <option value="client_side">طرف موکل</option>
              <option value="opponent">طرف مقابل</option>
              <option value="third">ثالث</option>
              <option value="opp_counsel">وکیل مقابل</option>
            </select>
            <button className="h-11 rounded-md bg-navy px-4 text-sm text-paper">افزودن</button>
          </form>
          <div className="space-y-2">
            {parties.map((p) => (
              <div key={p.id} className="flex flex-wrap justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-3">
                <div>
                  <p className="font-medium">{p.fullName}</p>
                  <p className="text-xs text-muted" dir="ltr">
                    {p.nationalCode || "—"}
                  </p>
                </div>
                <span className="text-sm text-muted">{partyRoleLabel[p.role]}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "timeline" && (
        <section className="space-y-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!action.trim()) return;
              addTimeline(id, action, "", "action");
              setAction("");
            }}
          >
            <input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="ثبت اقدام جدید"
              className="h-11 flex-1 rounded-md border border-line bg-surface px-3 text-sm"
            />
            <button className="h-11 rounded-md bg-navy px-4 text-sm text-paper">ثبت</button>
          </form>
          {timeline.map((ev, i) => (
            <div key={ev.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="mt-1 size-2.5 rounded-full bg-brass" />
                {i < timeline.length - 1 && <span className="w-px flex-1 bg-line" />}
              </div>
              <div className="pb-4">
                <p className="text-xs text-muted">
                  {ev.date} · {ev.time}
                </p>
                <p className="font-medium">{ev.title}</p>
                {ev.description && <p className="text-sm text-muted">{ev.description}</p>}
              </div>
            </div>
          ))}
          {timeline.length === 0 && <p className="text-sm text-muted">اقدامی ثبت نشده.</p>}
        </section>
      )}

      {tab === "docs" && (
        <section>
          <form
            className="mb-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!docTitle.trim()) return;
              addDocument(id, docTitle, "سند");
              setDocTitle("");
            }}
          >
            <input
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="عنوان سند"
              className="h-11 flex-1 rounded-md border border-line bg-surface px-3 text-sm"
            />
            <button className="h-11 rounded-md bg-navy px-4 text-sm text-paper">افزودن</button>
          </form>
          <div className="space-y-2">
            {documents.map((d) => (
              <div key={d.id} className="flex justify-between rounded-md border border-line bg-surface px-4 py-3 text-sm">
                <span>{d.title}</span>
                <span className="text-muted">
                  {d.kind} · {d.createdAt}
                </span>
              </div>
            ))}
            {documents.length === 0 && <p className="text-sm text-muted">سندی نیست.</p>}
          </div>
        </section>
      )}

      {tab === "deadlines" && (
        <section>
          <form
            className="mb-4 grid gap-2 sm:grid-cols-[1fr_10rem_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!dlTitle.trim() || !dlDate.trim()) return;
              addDeadline({
                title: dlTitle,
                caseId: id,
                dueDate: dlDate,
                type: "internal",
                isUrgent: false,
                legalArticle: "",
                ruleCode: "CUSTOM",
              });
              setDlTitle("");
              setDlDate("");
            }}
          >
            <input value={dlTitle} onChange={(e) => setDlTitle(e.target.value)} placeholder="عنوان موعد" className="h-11 rounded-md border border-line bg-surface px-3 text-sm" />
            <input value={dlDate} onChange={(e) => setDlDate(e.target.value)} placeholder="۱۴۰۵/۰۸/۰۱" className="h-11 rounded-md border border-line bg-surface px-3 text-sm" />
            <button className="h-11 rounded-md bg-navy px-4 text-sm text-paper">افزودن</button>
          </form>
          <div className="space-y-2">
            {deadlines.map((d) => (
              <button
                key={d.id}
                onClick={() => toggleDeadline(d.id)}
                className="flex w-full items-start justify-between rounded-md border border-line bg-surface p-4 text-right"
              >
                <div>
                  <p className={d.isCompleted ? "text-muted line-through" : "font-medium"}>{d.title}</p>
                  <p className="text-xs text-muted">{d.legalArticle}</p>
                  <DeadlineBadge type={d.type} />
                </div>
                <p className={d.isUrgent && !d.isCompleted ? "text-sm text-danger" : "text-sm text-muted"}>{d.dueDate}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === "finance" && (
        <section className="space-y-3">
          <button
            className="h-11 rounded-md border border-line px-4 text-sm"
            onClick={() =>
              addTransaction({
                caseId: id,
                type: "income",
                amount: 10_000_000,
                description: "ثبت دستی حق‌الوکاله",
                date: caseItem.openedAt,
                isTrust: false,
              })
            }
          >
            ثبت ۱۰ میلیون ریال حق‌الوکاله نمونه
          </button>
          {txs.map((t) => (
            <div key={t.id} className="flex justify-between rounded-md border border-line bg-surface px-4 py-3 text-sm">
              <span>
                {txLabel[t.type]} · {t.description}
              </span>
              <span className="tabular-nums">{money(t.amount)}</span>
            </div>
          ))}
          {txs.length === 0 && <p className="text-sm text-muted">تراکنشی نیست.</p>}
        </section>
      )}

      {tab === "notes" && (
        <section>
          <form
            className="mb-4 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              addNote(id, note);
              setNote("");
            }}
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-24 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              placeholder="یادداشت داخلی"
            />
            <button className="h-11 rounded-md bg-navy px-4 text-sm text-paper">ذخیره یادداشت</button>
          </form>
          <div className="space-y-2">
            {notes.map((n) => (
              <div key={n.id} className="rounded-md border border-line bg-surface p-4 text-sm">
                <p className="text-xs text-muted">{n.createdAt}</p>
                <p className="mt-1">{n.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "ai" && (
        <section className="space-y-3">
          <p className="text-sm text-muted">پیش‌نویس بر اساس مشخصات همین پرونده. متن باید پیش از تقدیم بازبینی شود.</p>
          <div className="flex flex-wrap gap-2">
            <button
              className="h-11 rounded-md bg-navy px-4 text-sm text-paper"
              onClick={() => setDraft(draftPetition("petition", caseItem, client))}
            >
              دادخواست
            </button>
            <button
              className="h-11 rounded-md border border-line px-4 text-sm"
              onClick={() => setDraft(draftPetition("defense", caseItem, client))}
            >
              دفاعیه
            </button>
            <button
              className="h-11 rounded-md border border-line px-4 text-sm"
              onClick={() => setDraft(draftPetition("appeal", caseItem, client))}
            >
              تجدیدنظر
            </button>
          </div>
          {draft && (
            <>
              <pre className="whitespace-pre-wrap rounded-xl border border-line bg-surface p-4 text-sm leading-7">{draft}</pre>
              <button
                className="h-11 rounded-md bg-navy px-4 text-sm text-paper"
                onClick={() => {
                  savePetition({ caseId: id, title: "پیش‌نویس هوشمند", body: draft });
                }}
              >
                ذخیره در پرونده
              </button>
            </>
          )}
        </section>
      )}
    </AppShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
