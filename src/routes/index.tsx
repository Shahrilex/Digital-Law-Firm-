import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { isIranMobile } from "@/lib/utils";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const user = useApp((s) => s.user);
  const setPending = useApp((s) => s.setPendingMobile);
  const login = useApp((s) => s.login);
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("09121234567");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = mobile.replace(/\D/g, "");
    if (!isIranMobile(cleaned)) {
      setError("شماره موبایل ایرانی معتبر وارد کنید.");
      return;
    }
    setPending(cleaned);
    navigate({ to: "/verify" });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <div className="absolute -top-24 -left-16 size-80 rounded-full border border-brass-soft" />
        <div className="absolute -bottom-20 -right-10 size-96 rounded-full border border-brass-soft" />
      </div>
      <div className="relative w-full max-w-md rounded-xl bg-surface p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-navy text-brass-soft">
            <Scale className="size-7" />
          </div>
          <h1 className="text-xl font-semibold text-navy">Jurist Assistant</h1>
          <p className="mt-1 text-sm text-muted">دستیار حقوقدان · مدیریت دفتر وکالت</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">شماره موبایل</label>
            <input
              dir="ltr"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="h-12 w-full rounded-md border border-line bg-paper px-3 text-left outline-none transition-colors focus:border-navy"
              placeholder="09123456789"
            />
            {error && <p className="mt-1 text-sm text-danger">{error}</p>}
          </div>
          <button type="submit" className="h-12 w-full rounded-md bg-navy text-sm font-medium text-paper hover:bg-navy-deep">
            دریافت کد تأیید
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-muted">نسخه نمایشی. کد تأیید واقعی ارسال نمی‌شود؛ هر کد ۴ تا ۶ رقمی پذیرفته است.</p>
        <p className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              login("09121234567");
              navigate({ to: "/dashboard" });
            }}
            className="text-sm text-brass hover:underline"
          >
            ورود سریع به داشبورد نمایشی
          </button>
        </p>
      </div>
    </main>
  );
}
