import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { memberRoleLabel } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { MemberRole } from "@/lib/types";

export const Route = createFileRoute("/team")({ component: TeamPage });

function TeamPage() {
  const members = useApp((s) => s.members);
  const addMember = useApp((s) => s.addMember);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<MemberRole>("trainee");

  return (
    <AppShell>
      <PageHeader title="تیم دفتر" subtitle="اعضای فضای کاری و سطح دسترسی نمایشی" />
      <form
        className="mb-5 grid gap-2 rounded-xl border border-line bg-surface p-4 sm:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!fullName.trim()) return;
          addMember({ fullName, mobile, role });
          setFullName("");
          setMobile("");
        }}
      >
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="نام" className="h-11 rounded-md border border-line bg-paper px-3 text-sm" />
        <input dir="ltr" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="موبایل" className="h-11 rounded-md border border-line bg-paper px-3 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value as MemberRole)} className="h-11 rounded-md border border-line bg-paper px-3 text-sm">
          <option value="lawyer">وکیل</option>
          <option value="trainee">کارآموز</option>
          <option value="secretary">منشی</option>
          <option value="accountant">حسابدار</option>
        </select>
        <button className="h-11 rounded-md bg-navy text-sm text-paper">افزودن عضو</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="border-b border-line bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 text-right font-medium">نام</th>
              <th className="px-4 py-3 text-right font-medium">نقش</th>
              <th className="px-4 py-3 text-right font-medium">موبایل</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{m.fullName}</td>
                <td className="px-4 py-3">{memberRoleLabel[m.role]}</td>
                <td className="px-4 py-3" dir="ltr">
                  {m.mobile}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
