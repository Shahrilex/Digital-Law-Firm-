import { fromFaDigits, toFaDigits } from "./utils";

export const jalaliMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export type JDate = { y: number; m: number; d: number };

export function parseJalali(s: string): JDate | null {
  const n = fromFaDigits(s).replace(/-/g, "/").trim();
  const m = n.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

export function formatJalali(y: number, m: number, d: number) {
  return toFaDigits(`${y}/${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`);
}

export function formatJ(j: JDate) {
  return formatJalali(j.y, j.m, j.d);
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  const sal = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 1;
  while (gm <= 12 && gd > sal[gm]) {
    gd -= sal[gm];
    gm++;
  }
  return [gy, gm, gd];
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JDate {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gdm[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { y: jy, m: jm, d: jd };
}

export function todayJ(): JDate {
  const n = new Date();
  return gregorianToJalali(n.getFullYear(), n.getMonth() + 1, n.getDate());
}

export function daysInJalaliMonth(y: number, m: number) {
  if (m <= 6) return 31;
  if (m <= 11) return 30;
  const [gy] = jalaliToGregorian(y, 12, 30);
  const leapCheck = gregorianToJalali(gy, 3, 21);
  return leapCheck.d === 21 && leapCheck.m === 1 ? 30 : 29;
}

export function weekdaySat0(j: JDate) {
  const [gy, gm, gd] = jalaliToGregorian(j.y, j.m, j.d);
  const d = new Date(gy, gm - 1, gd).getDay();
  return (d + 1) % 7;
}

export function addDays(j: JDate, n: number): JDate {
  const [gy, gm, gd] = jalaliToGregorian(j.y, j.m, j.d);
  const dt = new Date(gy, gm - 1, gd);
  dt.setDate(dt.getDate() + n);
  return gregorianToJalali(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
}

export function jKey(j: JDate) {
  return `${j.y}-${j.m}-${j.d}`;
}

const FIXED_HOLIDAYS = new Set([
  "1-1",
  "1-2",
  "1-3",
  "1-4",
  "1-12",
  "1-13",
  "3-14",
  "3-15",
  "11-22",
  "12-29",
]);

export function isWeekendOrHoliday(j: JDate) {
  if (weekdaySat0(j) === 6) return true;
  return FIXED_HOLIDAYS.has(`${j.m}-${j.d}`);
}

export function holidayLabel(j: JDate) {
  if (weekdaySat0(j) === 6) return "جمعه";
  const map: Record<string, string> = {
    "1-1": "عید نوروز",
    "1-2": "عید نوروز",
    "1-3": "عید نوروز",
    "1-4": "عید نوروز",
    "1-12": "روز جمهوری اسلامی",
    "1-13": "سیزده‌به‌در",
    "3-14": "رحلت امام خمینی",
    "3-15": "قیام ۱۵ خرداد",
    "11-22": "پیروزی انقلاب",
    "12-29": "ملی شدن نفت",
  };
  return map[`${j.m}-${j.d}`] ?? "";
}

export function nextWorkingDay(j: JDate): JDate {
  let cur = j;
  let guard = 0;
  while (isWeekendOrHoliday(cur) && guard < 14) {
    cur = addDays(cur, 1);
    guard++;
  }
  return cur;
}

export function monthGrid(y: number, m: number) {
  const first = { y, m, d: 1 };
  const offset = weekdaySat0(first);
  const dim = daysInJalaliMonth(y, m);
  const cells: (JDate | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push({ y, m, d });
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function shiftMonth(y: number, m: number, delta: number) {
  let mm = m + delta;
  let yy = y;
  while (mm < 1) {
    mm += 12;
    yy -= 1;
  }
  while (mm > 12) {
    mm -= 12;
    yy += 1;
  }
  return { y: yy, m: mm };
}
