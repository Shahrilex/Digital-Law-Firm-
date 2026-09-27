import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Menu,
  Scale,
  Search,
  Settings,
  ShieldAlert,
  Users,
  Wallet,
  Wrench,
  BarChart3,
  X,
  Bell,
  Building2,
  Globe,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { planLabel } from "@/lib/seed";

type NavTo =
  | "/dashboard"
  | "/clients"
  | "/cases"
  | "/deadlines"
  | "/calendar"
  | "/editor"
  | "/finance"
  | "/reports"
  | "/tools"
  | "/library"
  | "/conflict"
  | "/team"
  | "/portal"
  | "/settings";


const groups: {
  label: string;
  items: { to: NavTo; label: string; icon: typeof LayoutDashboard }[];
}[] = [
  {
    label: "کارتابل",
    items: [
      { to: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
      { to: "/clients", label: "موکلین", icon: Users },
      { to: "/cases", label: "پرونده‌ها", icon: Briefcase },
    ],
  },
  {
    label: "اجرا",
    items: [
      { to: "/deadlines", label: "مواعد", icon: CalendarDays },
      { to: "/calendar", label: "تقویم", icon: CalendarDays },
      { to: "/editor", label: "ویرایشگر لایحه", icon: FileText },
    ],
  },
  {
    label: "دفتر",
    items: [
      { to: "/finance", label: "مالی", icon: Wallet },
      { to: "/reports", label: "گزارش‌ها", icon: BarChart3 },
      { to: "/tools", label: "ابزارها", icon: Wrench },
      { to: "/library", label: "منابع حقوقی", icon: BookOpen },
      { to: "/conflict", label: "تعارض منافع", icon: ShieldAlert },
      { to: "/team", label: "تیم", icon: Building2 },
      { to: "/portal", label: "پورتال موکل", icon: Globe },
      { to: "/settings", label: "تنظیمات", icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useApp((s) => s.user);
  const hydrated = useApp((s) => s.hydrated);
  const setHydrated = useApp((s) => s.setHydrated);
  const logout = useApp((s) => s.logout);
  const notices = useApp((s) => s.notices);
  const markNotice = useApp((s) => s.markNotice);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [q, setQ] = useState("");
  const clients = useApp((s) => s.clients);
  const cases = useApp((s) => s.cases);

  useEffect(() => {
    if (useApp.persist.hasHydrated()) setHydrated();
    const t = setTimeout(() => setHydrated(), 80);
    return () => clearTimeout(t);
  }, [setHydrated]);

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/" });
  }, [hydrated, user, navigate]);

  const unread = notices.filter((n) => !n.read).length;

  const hits = useMemo(() => {
    const query = q.trim();
    if (query.length < 2) return [];
    const clientHits = clients
      .filter((c) => c.fullName.includes(query) || c.nationalCode.includes(query) || c.mobile.includes(query))
      .slice(0, 4)
      .map((c) => ({ id: c.id, label: c.fullName, kind: "موکل" as const, route: "client" as const }));
    const caseHits = cases
      .filter((c) => c.title.includes(query) || c.caseNumber.includes(query))
      .slice(0, 4)
      .map((c) => ({ id: c.id, label: c.title, kind: "پرونده" as const, route: "case" as const }));
    return [...clientHits, ...caseHits];
  }, [q, clients, cases]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-muted">
        در حال بارگذاری دفتر...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-64 flex-col bg-navy text-paper transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center gap-3 border-b border-paper/10 px-5 py-5">
          <div className="flex size-10 items-center justify-center rounded-md bg-brass-soft/15 text-brass-soft">
            <Scale className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Jurist Assistant</div>
            <div className="text-xs text-paper/55">دستیار حقوقدان</div>
          </div>
          <button className="mr-auto rounded-md p-2 text-paper/70 md:hidden" onClick={() => setOpen(false)} aria-label="بستن منو">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="mb-1 px-3 text-[11px] uppercase tracking-wider text-paper/40">{g.label}</p>
              <div className="space-y-1">
                {g.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                        active ? "bg-brass-soft font-medium text-navy" : "text-paper/80 hover:bg-paper/10",
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-paper/10 p-4">
          <div className="text-sm font-medium">{user.fullName}</div>
          <div className="text-xs text-paper/55">
            {user.role} · پلن {planLabel[user.plan]}
          </div>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="mt-3 text-xs text-paper/50 hover:text-paper"
          >
            خروج
          </button>
        </div>
      </aside>

      {open && (
        <button className="fixed inset-0 z-30 bg-navy/40 md:hidden" onClick={() => setOpen(false)} aria-label="بستن" />
      )}

      <div className="md:mr-64">
        <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
          <div className="flex items-center gap-2 px-4 py-3">
            <button className="rounded-md p-2 text-navy md:hidden" onClick={() => setOpen(true)} aria-label="منو">
              <Menu className="size-5" />
            </button>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو در موکل، کد ملی و پرونده..."
                className="h-11 w-full rounded-md border border-line bg-paper pr-10 pl-3 text-sm outline-none transition-colors focus:border-navy"
              />
              {hits.length > 0 && (
                <div className="absolute mt-1 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
                  {hits.map((h) =>
                    h.route === "client" ? (
                      <Link
                        key={`c-${h.id}`}
                        to="/clients/$id"
                        params={{ id: h.id }}
                        onClick={() => setQ("")}
                        className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-paper"
                      >
                        <span>{h.label}</span>
                        <span className="text-xs text-muted">{h.kind}</span>
                      </Link>
                    ) : (
                      <Link
                        key={`p-${h.id}`}
                        to="/cases/$id"
                        params={{ id: h.id }}
                        onClick={() => setQ("")}
                        className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-paper"
                      >
                        <span>{h.label}</span>
                        <span className="text-xs text-muted">{h.kind}</span>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="relative flex size-11 items-center justify-center rounded-md border border-line text-navy"
                onClick={() => setBell((v) => !v)}
                aria-label="اعلان‌ها"
              >
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute top-1.5 left-1.5 size-2 rounded-full bg-danger" />
                )}
              </button>
              {bell && (
                <div className="absolute left-0 mt-2 w-72 overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
                  {notices.length === 0 && <p className="p-3 text-sm text-muted">اعلانی نیست.</p>}
                  {notices.map((n) => (
                    <button
                      key={n.id}
                      className="block w-full border-b border-line p-3 text-right last:border-0 hover:bg-paper"
                      onClick={() => {
                        markNotice(n.id);
                        setBell(false);
                        if (n.href) {
                          if (n.href === "/deadlines") navigate({ to: "/deadlines" });
                          else if (n.href === "/conflict") navigate({ to: "/conflict" });
                          else if (n.href === "/calendar") navigate({ to: "/calendar" });
                        }
                      }}
                    >
                      <p className={cn("text-sm", n.read ? "text-muted" : "font-medium text-navy")}>{n.title}</p>
                      <p className="text-xs text-muted">{n.body}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
