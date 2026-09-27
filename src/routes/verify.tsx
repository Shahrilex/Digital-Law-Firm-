import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/verify")({ component: Verify });

function Verify() {
  const pending = useApp((s) => s.pendingMobile);
  const login = useApp((s) => s.login);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [count, setCount] = useState(60);

  useEffect(() => {
    if (!pending) navigate({ to: "/" });
  }, [pending, navigate]);

  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(code)) {
      setError("کد باید ۴ تا ۶ رقم باشد.");
      return;
    }
    login(pending || "09121234567");
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-navy text-brass-soft">
            <Scale className="size-7" />
          </div>
          <h1 className="text-xl font-semibold text-navy">تأیید هویت</h1>
          <p className="mt-1 text-sm text-muted">
            کد نمایشی را وارد کنید
            {pending ? (
              <>
                {" "}
                (<span dir="ltr">{pending}</span>)
              </>
            ) : null}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            dir="ltr"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-14 w-full rounded-md border border-line bg-paper px-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-navy"
            placeholder="1234"
            autoFocus
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            className="h-12 w-full rounded-md bg-navy text-sm font-medium text-paper hover:bg-navy-deep"
          >
            ورود به دفتر
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          {count > 0 ? `ارسال مجدد تا ${count} ثانیه` : "می‌توانید دوباره کد بخواهید"}
        </p>
        <p className="mt-3 text-center text-xs">
          <Link to="/" className="text-brass hover:underline">
            تغییر شماره
          </Link>
        </p>
      </div>
    </main>
  );
}
