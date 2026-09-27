import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/Badges";
import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/clients/$id")({ component: ClientDetail });

function ClientDetail() {
  const { id } = Route.useParams();
  const client = useApp((s) => s.clients.find((c) => c.id === id));
  const cases = useApp((s) => s.cases.filter((c) => c.clientId === id));
  const updateClient = useApp((s) => s.updateClient);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(client?.fullName ?? "");
  const [mobile, setMobile] = useState(client?.mobile ?? "");
  const [address, setAddress] = useState(client?.address ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [notes, setNotes] = useState(client?.notes ?? "");

  if (!client) {
    return (
      <AppShell>
        <p className="text-muted">موکل یافت نشد.</p>
        <Link to="/clients" className="text-sm text-brass">
          بازگشت
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link to="/clients" className="mb-3 inline-block text-sm text-muted hover:text-navy">
        بازگشت به موکلین
      </Link>
      <PageHeader
        title={client.fullName}
        subtitle={`${client.type === "individual" ? "شخص حقیقی" : "شخص حقوقی"} · از ${client.createdAt}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setEditing((v) => !v)} className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm">
              {editing ? "انصراف" : "ویرایش"}
            </button>
            <Link
              to="/cases/new"
              search={{ clientId: client.id }}
              className="inline-flex h-11 items-center rounded-md bg-navy px-4 text-sm font-medium text-paper"
            >
              تشکیل پرونده
            </Link>
          </div>
        }
      />
      {editing ? (
        <form
          className="mb-6 max-w-xl space-y-3 rounded-xl border border-line bg-surface p-5"
          onSubmit={(e) => {
            e.preventDefault();
            updateClient(id, { fullName, mobile, address, email, notes });
            setEditing(false);
          }}
        >
          <Field label="نام" value={fullName} onChange={setFullName} />
          <Field label="موبایل" value={mobile} onChange={setMobile} ltr />
          <Field label="ایمیل" value={email} onChange={setEmail} ltr />
          <Field label="نشانی" value={address} onChange={setAddress} />
          <label className="block text-sm font-medium">
            یادداشت
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm" />
          </label>
          <button className="h-11 rounded-md bg-navy px-5 text-sm text-paper">ذخیره</button>
        </form>
      ) : (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="کد / شناسه" value={client.nationalCode || "—"} ltr />
          <Info label="موبایل" value={client.mobile} ltr />
          <Info label="ایمیل" value={client.email || "—"} ltr />
          <Info label="نشانی" value={client.address || "—"} />
        </div>
      )}
      {client.notes && !editing && (
        <div className="mb-6 rounded-xl border border-line bg-surface p-4 text-sm">{client.notes}</div>
      )}
      <h2 className="mb-3 font-semibold text-navy">پرونده‌ها</h2>
      <div className="space-y-2">
        {cases.length === 0 && <p className="text-sm text-muted">پرونده‌ای ثبت نشده است.</p>}
        {cases.map((c) => (
          <Link
            key={c.id}
            to="/cases/$id"
            params={{ id: c.id }}
            className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 hover:border-navy/30"
          >
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="text-xs text-muted">{c.caseNumber}</p>
            </div>
            <StatusBadge status={c.status} />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function Info({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-medium" dir={ltr ? "ltr" : "rtl"}>
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ltr,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ltr?: boolean;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        dir={ltr ? "ltr" : "rtl"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
      />
    </label>
  );
}
