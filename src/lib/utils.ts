import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return crypto.randomUUID();
}

export function fromFaDigits(value: string) {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const i = fa.indexOf(d);
    if (i >= 0) return String(i);
    const j = ar.indexOf(d);
    return j >= 0 ? String(j) : d;
  });
}

export function toFaDigits(value: string | number) {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/\d/g, (d) => map[Number(d)] ?? d);
}

export function todayJalali() {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return "۱۴۰۵/۰۷/۰۵";
  }
}

export function nowTime() {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    return "۱۲:۰۰";
  }
}

export function isIranMobile(value: string) {
  return /^09\d{9}$/.test(value.replace(/\D/g, ""));
}

export function money(n: number) {
  return `${toFaDigits(Math.round(n).toLocaleString("en-US"))} ریال`;
}
