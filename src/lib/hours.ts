import { site } from "./site";

/** Current weekday + fractional hour in Belgrade, regardless of the visitor's timezone. */
export function belgradeNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Belgrade",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, hour: Number(get("hour")) + Number(get("minute")) / 60 };
}

export type OpenState = { open: true; closes: number } | { open: false; nextDay: number; opens: number; inDays: number };

export function openState(date = new Date()): OpenState {
  const { day, hour } = belgradeNow(date);
  const today = site.hours.find((h) => h.day === day);
  if (today && hour >= today.open && hour < today.close) return { open: true, closes: today.close };
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const h = site.hours.find((x) => x.day === d);
    if (!h) continue;
    if (i === 0 && hour >= h.open) continue;
    return { open: false, nextDay: d, opens: h.open, inDays: i };
  }
  return { open: false, nextDay: 2, opens: 9, inDays: 1 };
}
