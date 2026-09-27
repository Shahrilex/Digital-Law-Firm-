import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/clients/new")({ component: NewClient });

function NewClient() {
  const addClient = useApp((s) => s.addClient);
  const navigate = useNavigate();
  const [type, setType] = useState<"individual" | "company">("individual");
  const [fullName, setFullName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addClient({
      fullName,
      nationalCode,
      mobile,
      type,
      address,
      email,
      notes,
    });
    if (!res.ok) {
      setMsg(res.message);
      return;
    }
    navigate({ to: "/clients/$id", params: { id: res.id! } });
  };

  return (
    <AppShell>
      <Link to="/clients" className="mb-3 inline-block text-sm text-muted hover:text-navy">
        بازگشت
      </Link>
      <h1 className="mb-5 text-2xl font-semibold text-navy">ثبت موکل جدید</h1>
      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-lg border border-line bg-surface p-5">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={type === "individual"} onChange={() => setType("individual")} />
            حقیقی
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={type === "company"} onChange={() => setType("company")} />
            حقوقی
          </label>
        </div>
        <Field
          label={type === "individual" ? "نام و نام خانوادگی" : "نام شرکت"}
          value={fullName}
          onChange={setFullName}
          required
        />
        <Field
          label={type === "individual" ? "کد ملی" : "شناسه ملی"}
          value={nationalCode}
          onChange={setNationalCode}
          ltr
        />
        <Field label="موبایل" value={mobile} onChange={setMobile} ltr required />
        <Field label="نشانی" value={address} onChange={setAddress} />
        <Field label="ایمیل" value={email} onChange={setEmail} ltr />
        <div>
          <label className="mb-1 block text-sm font-medium">یادداشت</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-24 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
        {msg && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{msg}</p>}
        <div className="flex gap-2">
          <button type="submit" className="h-11 rounded-md bg-navy px-5 text-sm font-medium text-paper">
            ثبت
          </button>
          <Link to="/clients" className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm">
            انصراف
          </Link>
        </div>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  ltr,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ltr?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        dir={ltr ? "ltr" : "rtl"}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-navy"
      />
    </div>
  );
}
