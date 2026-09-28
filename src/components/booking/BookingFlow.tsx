"use client";

/*
 * Booking flow UI: service → stylist → day & time → contact.
 *
 * This is a front-end demo: nothing is sent anywhere. For a real client this is
 * where the salon's booking system plugs in — in Serbia typically a sredime.rs
 * widget/API (as on Sip & Style), or Fresha / Booksy elsewhere. Availability
 * would come from that system instead of the generated slots below.
 */

import Image from "next/image";
import { Suspense, useMemo, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { priceCategories, allPriceItems, lengthLabels, formatRsd, type Length } from "@/content/prices";
import { team } from "@/content/team";
import { img } from "@/content/images";
import { site } from "@/lib/site";

type Step = 0 | 1 | 2 | 3;

const T = {
  sr: {
    steps: ["Usluga", "Stilista", "Termin", "Podaci"],
    chooseService: "Izaberite uslugu",
    length: "Dužina kose",
    chooseStylist: "Kod koga želite?",
    anyone: "Bilo ko",
    anyoneText: "Prvi slobodan termin",
    chooseTime: "Izaberite dan i vreme",
    noSlots: "Nema slobodnih termina ovog dana.",
    details: "Vaši podaci",
    name: "Ime i prezime",
    phone: "Telefon",
    email: "E-mail (nije obavezno)",
    note: "Napomena (nije obavezno)",
    notePh: "npr. prvi put farbam kosu, imam sliku željene nijanse…",
    consent: "Slažem se da me salon kontaktira u vezi sa ovim terminom.",
    next: "Dalje",
    back: "Nazad",
    confirm: "Potvrdi termin",
    summary: "Vaš termin",
    service: "Usluga",
    stylist: "Stilista",
    when: "Termin",
    price: "Cena",
    duration: "Trajanje",
    pick: "—",
    errors: {
      name: "Unesite ime i prezime.",
      phone: "Unesite ispravan broj telefona (npr. 064 123 4567).",
      email: "E-mail adresa nije ispravna.",
      consent: "Potrebna je vaša saglasnost.",
    },
    doneTitle: "Vidimo se uskoro.",
    doneText: (name: string) => `Hvala, ${name}! Ovo je demo sajt, pa termin nije zaista rezervisan — ali pravi klijent bi sada dobio SMS potvrdu i podsetnik dan ranije.`,
    again: "Zakaži još jedan termin",
    demo: "Demo — ništa se ne šalje",
    free: "slobodno",
    today: "Danas",
    months: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"],
    days: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
    morning: "Pre podne",
    afternoon: "Popodne",
    evening: "Uveče",
    search: "Pretraži usluge",
    stepOf: (a: number, b: number) => `Korak ${a} od ${b}`,
  },
  en: {
    steps: ["Service", "Stylist", "Time", "Details"],
    chooseService: "Choose a service",
    length: "Hair length",
    chooseStylist: "Who would you like?",
    anyone: "Anyone",
    anyoneText: "First available",
    chooseTime: "Pick a day and time",
    noSlots: "No free slots on this day.",
    details: "Your details",
    name: "Full name",
    phone: "Phone",
    email: "Email (optional)",
    note: "Note (optional)",
    notePh: "e.g. first time colouring, I have a photo of the shade I want…",
    consent: "I agree to be contacted by the salon about this appointment.",
    next: "Continue",
    back: "Back",
    confirm: "Confirm appointment",
    summary: "Your appointment",
    service: "Service",
    stylist: "Stylist",
    when: "When",
    price: "Price",
    duration: "Duration",
    pick: "—",
    errors: {
      name: "Please enter your full name.",
      phone: "Please enter a valid phone number (e.g. +381 64 123 4567).",
      email: "That email address doesn't look right.",
      consent: "We need your consent to continue.",
    },
    doneTitle: "See you soon.",
    doneText: (name: string) => `Thank you, ${name}! This is a demo site, so nothing was actually booked — a real client would now get an SMS confirmation and a reminder the day before.`,
    again: "Book another appointment",
    demo: "Demo — nothing is sent",
    free: "free",
    today: "Today",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    search: "Search services",
    stepOf: (a: number, b: number) => `Step ${a} of ${b}`,
  },
};

/** Deterministic pseudo-random so "taken" slots look real but stay stable. */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
};

function upcomingDays(n = 14) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < n) {
    if (site.hours.some((h) => h.day === d.getDay())) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const slotsFor = (day: Date, stylist: string) => {
  const res: { t: string; free: boolean }[] = [];
  const now = new Date();
  for (let m = 9 * 60; m <= 19 * 60 + 30; m += 30) {
    const t = `${Math.floor(m / 60)}:${m % 60 === 0 ? "00" : "30"}`;
    const past = day.toDateString() === now.toDateString() && m <= now.getHours() * 60 + now.getMinutes() + 60;
    const taken = hash(`${day.toDateString()}-${stylist}-${t}`) < 0.42;
    res.push({ t, free: !past && !taken });
  }
  return res;
};

type Initial = { service?: string; category?: string; stylist?: string };

/** Reads ?usluga=…&stilista=… (links from the price list and stylist cards). */
function WithParams({ locale }: { locale: Locale }) {
  const q = useSearchParams();
  const item = allPriceItems.find((i) => i.id === q.get("usluga"));
  const st = q.get("stilista");
  const initial: Initial = { service: item?.id, category: item?.category.id, stylist: st && team.some((m) => m.id === st) ? st : undefined };
  return <Flow key={q.toString()} locale={locale} initial={initial} />;
}

export function BookingFlow({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<Flow locale={locale} initial={{}} />}>
      <WithParams locale={locale} />
    </Suspense>
  );
}

function Flow({ locale, initial }: { locale: Locale; initial: Initial }) {
  const t = T[locale];
  const [step, setStep] = useState<Step>(0);
  const [serviceId, setServiceId] = useState<string | null>(initial.service ?? null);
  const [length, setLength] = useState<Length>("medium");
  const [stylist, setStylist] = useState<string | null>(initial.stylist ?? null);
  const [day, setDay] = useState<number>(0);
  const [time, setTime] = useState<string | null>(null);
  const [cat, setCat] = useState(initial.category ?? priceCategories[0].id);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "", consent: false });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [done, setDone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const days = useMemo(() => upcomingDays(), []);

  const item = serviceId ? allPriceItems.find((i) => i.id === serviceId) : undefined;
  const hasLength = item && typeof item.price !== "number";
  const price = item ? (typeof item.price === "number" ? item.price : item.price[length]) : null;
  const eligible = item ? team.filter((m) => m.services.includes(item.category.service)) : team;
  const stylistObj = team.find((m) => m.id === stylist);
  const slots = slotsFor(days[day], stylist ?? "any");

  const canNext = [!!item, !!stylist, !!time, true][step];

  const go = (s: Step) => {
    setStep(s);
    requestAnimationFrame(() => {
      const top = (panel.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
      panel.current?.querySelector<HTMLElement>("h2")?.focus();
    });
  };

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().split(/\s+/).length < 2) e.name = t.errors.name;
    if (!/^\+?[\d\s/()-]{8,}$/.test(form.phone.trim()) || form.phone.replace(/\D/g, "").length < 8) e.phone = t.errors.phone;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = t.errors.email;
    if (!form.consent) e.consent = t.errors.consent;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const first = panel.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setDone(true);
  };

  const dateLabel = (d: Date) => `${t.days[d.getDay()]} ${d.getDate()}. ${t.months[d.getMonth()]}`;

  const Summary = (
    <aside className="theme-ink relative overflow-hidden p-7 md:p-9 lg:sticky lg:top-28" aria-label={t.summary}>
      {/* ticket notches */}
      <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cream" />
      <span aria-hidden className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cream" />
      <div className="flex items-center justify-between">
        <p className="t-eyebrow text-champagne">{t.summary}</p>
        <p className="t-eyebrow text-muted">Ondine</p>
      </div>
      <dl className="mt-8 space-y-5">
        {[
          [t.service, item ? `${item.name[locale]}${hasLength ? ` · ${lengthLabels[length][locale]}` : ""}` : t.pick],
          [t.stylist, stylist === "any" ? t.anyone : stylistObj?.name ?? t.pick],
          [t.when, time ? `${dateLabel(days[day])} · ${time}` : t.pick],
          [t.duration, item ? `${item.duration} min` : t.pick],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-dashed border-line pb-4">
            <dt className="t-eyebrow text-muted">{k}</dt>
            <dd key={v} className={clsx("mt-1.5 font-serif text-[1.35rem] leading-snug", v !== t.pick && "animate-[fade-in_0.8s_var(--ease-out-expo)]")}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex items-end justify-between">
        <span className="t-eyebrow text-muted">{t.price}</span>
        <span className="font-serif text-4xl">{price ? `${item?.from ? `${locale === "sr" ? "od" : "from"} ` : ""}${formatRsd(price, locale)}` : t.pick}</span>
      </div>
      <p className="mt-6 text-[0.75rem] text-muted">{t.demo}</p>
    </aside>
  );

  if (done) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]" aria-live="polite">
        <div className="flex flex-col justify-center">
          <div className="relative mb-10 grid h-28 w-28 place-items-center rounded-full border-2 border-wine text-wine [animation:stamp_0.9s_var(--ease-out-expo)_both]">
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h2 className="t-h1" tabIndex={-1}>
            {t.doneTitle}
          </h2>
          <p className="t-lead mt-6 max-w-lg text-muted">{t.doneText(form.name.split(" ")[0])}</p>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setStep(0);
              setTime(null);
            }}
            className="mt-10 inline-flex min-h-12 w-fit items-center rounded-full border border-line px-7 font-medium hover:border-fg"
          >
            {t.again}
          </button>
        </div>
        {Summary}
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div ref={panel}>
        {/* Progress */}
        <ol className="mb-10 grid grid-cols-4 gap-2" aria-label={t.stepOf(step + 1, 4)}>
          {t.steps.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                disabled={i > step}
                onClick={() => go(i as Step)}
                aria-current={i === step ? "step" : undefined}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className="block h-[2px] overflow-hidden bg-line">
                  <span className="block h-full origin-left bg-wine transition-transform duration-700 ease-[var(--ease-out-expo)]" style={{ transform: `scaleX(${i <= step ? 1 : 0})` }} />
                </span>
                <span className={clsx("t-eyebrow mt-3 block", i === step ? "text-fg" : "text-muted")}>
                  0{i + 1} <span className="hidden sm:inline">{s}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div key={step} className="animate-[fade-in_0.8s_var(--ease-out-expo)]">
          {step === 0 && (
            <fieldset>
              <legend className="contents">
                <h2 className="t-h2 mb-8 outline-none" tabIndex={-1}>
                  {t.chooseService}
                </h2>
              </legend>
              <div className="no-scrollbar -mx-[var(--gutter)] mb-6 flex gap-2 overflow-x-auto px-[var(--gutter)]" role="group" aria-label={t.search}>
                {priceCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCat(c.id)}
                    aria-pressed={cat === c.id}
                    className={clsx(
                      "min-h-11 shrink-0 rounded-full border px-4 text-[0.9rem] transition-colors duration-300",
                      cat === c.id ? "border-ink bg-ink text-cream" : "border-line hover:border-fg",
                    )}
                  >
                    {c.name[locale]}
                  </button>
                ))}
              </div>
              <div className="grid gap-2">
                {priceCategories
                  .find((c) => c.id === cat)!
                  .items.map((i) => {
                    const p = typeof i.price === "number" ? i.price : i.price[length];
                    return (
                      <label
                        key={i.id}
                        className={clsx(
                          "flex min-h-16 cursor-pointer items-center justify-between gap-4 border px-5 py-4 transition-colors duration-300",
                          serviceId === i.id ? "border-wine bg-blush/50" : "border-line hover:border-fg",
                        )}
                      >
                        <span className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="service"
                            checked={serviceId === i.id}
                            onChange={() => setServiceId(i.id)}
                            className="h-4 w-4 accent-[var(--wine)]"
                          />
                          <span>
                            <span className="block font-medium">{i.name[locale]}</span>
                            <span className="text-[0.85rem] text-muted">{i.duration} min</span>
                          </span>
                        </span>
                        <span className="whitespace-nowrap font-serif text-xl">{formatRsd(p, locale)}</span>
                      </label>
                    );
                  })}
              </div>
              {hasLength && (
                <fieldset className="mt-8">
                  <legend className="t-eyebrow mb-3 text-muted">{t.length}</legend>
                  <div className="flex flex-wrap gap-2">
                    {(["short", "medium", "long"] as Length[]).map((l) => (
                      <label key={l} className={clsx("min-h-11 cursor-pointer rounded-full border px-5 py-2.5 text-[0.9rem]", length === l ? "border-ink bg-ink text-cream" : "border-line")}>
                        <input type="radio" name="length" className="sr-only" checked={length === l} onChange={() => setLength(l)} />
                        {lengthLabels[l][locale]}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="contents">
                <h2 className="t-h2 mb-8 outline-none" tabIndex={-1}>
                  {t.chooseStylist}
                </h2>
              </legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className={clsx("flex aspect-[3/4] cursor-pointer flex-col justify-end border p-5 transition-colors", stylist === "any" ? "border-wine bg-blush/50" : "border-line hover:border-fg")}>
                  <input type="radio" name="stylist" className="sr-only" checked={stylist === "any"} onChange={() => setStylist("any")} />
                  <span className="font-serif text-3xl italic">{t.anyone}</span>
                  <span className="mt-1 text-[0.85rem] text-muted">{t.anyoneText}</span>
                </label>
                {eligible.map((m) => (
                  <label key={m.id} className={clsx("group relative aspect-[3/4] cursor-pointer overflow-hidden border-2 transition-colors", stylist === m.id ? "border-wine" : "border-transparent")}>
                    <input type="radio" name="stylist" className="peer sr-only" checked={stylist === m.id} onChange={() => setStylist(m.id)} />
                    <Image src={img[m.portrait].src} alt="" fill sizes="(min-width: 640px) 20vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-4 text-cream">
                      <span className="block font-serif text-2xl">{m.name.split(" ")[0]}</span>
                      <span className="text-[0.8rem] opacity-80">{m.role[locale]}</span>
                    </span>
                    <span className="absolute inset-0 ring-2 ring-inset ring-transparent peer-focus-visible:ring-wine" />
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <div>
              <h2 className="t-h2 mb-8 outline-none" tabIndex={-1}>
                {t.chooseTime}
              </h2>
              <div className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2" role="radiogroup" aria-label={t.when}>
                {days.map((d, i) => (
                  <button
                    key={d.toISOString()}
                    type="button"
                    role="radio"
                    aria-checked={day === i}
                    onClick={() => {
                      setDay(i);
                      setTime(null);
                    }}
                    className={clsx(
                      "flex min-w-[4.6rem] shrink-0 flex-col items-center rounded-full border px-3 py-4 transition-colors duration-300",
                      day === i ? "border-ink bg-ink text-cream" : "border-line hover:border-fg",
                    )}
                  >
                    <span className="t-eyebrow text-[0.6rem] opacity-70">{t.days[d.getDay()]}</span>
                    <span className="mt-1 font-serif text-2xl">{d.getDate()}</span>
                    <span className="text-[0.7rem] opacity-70">{t.months[d.getMonth()]}</span>
                  </button>
                ))}
              </div>
              {[
                [t.morning, 9, 12],
                [t.afternoon, 12, 17],
                [t.evening, 17, 21],
              ].map(([label, a, b]) => {
                const group = slots.filter((s) => {
                  const h = Number(s.t.split(":")[0]);
                  return h >= (a as number) && h < (b as number);
                });
                return (
                  <div key={label as string} className="mt-8">
                    <p className="t-eyebrow mb-3 text-muted">{label}</p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="radiogroup" aria-label={label as string}>
                      {group.map((s) => (
                        <button
                          key={s.t}
                          type="button"
                          role="radio"
                          aria-checked={time === s.t}
                          disabled={!s.free}
                          onClick={() => setTime(s.t)}
                          className={clsx(
                            "min-h-11 rounded-full border text-[0.9rem] tabular-nums transition-colors duration-300 disabled:cursor-not-allowed disabled:border-transparent disabled:text-muted disabled:line-through disabled:opacity-50",
                            time === s.t ? "border-wine bg-wine text-cream" : "border-line hover:border-fg",
                          )}
                        >
                          {s.t}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {!slots.some((s) => s.free) && <p className="mt-6 text-muted">{t.noSlots}</p>}
            </div>
          )}

          {step === 3 && (
            <form id="booking-form" onSubmit={submit} noValidate>
              <h2 className="t-h2 mb-8 outline-none" tabIndex={-1}>
                {t.details}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", t.name, "text", "name"],
                    ["phone", t.phone, "tel", "tel"],
                    ["email", t.email, "email", "email"],
                  ] as const
                ).map(([k, label, type, ac]) => (
                  <label key={k} className={clsx("block", k === "email" && "sm:col-span-2")}>
                    <span className="t-eyebrow mb-2 block text-muted">{label}</span>
                    <input
                      type={type}
                      autoComplete={ac}
                      value={form[k]}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      aria-invalid={errors[k] ? "true" : undefined}
                      aria-describedby={errors[k] ? `err-${k}` : undefined}
                      className="h-13 w-full border-b border-line bg-transparent py-3 text-[1.1rem] outline-none transition-colors focus:border-fg aria-[invalid=true]:border-wine"
                    />
                    {errors[k] && (
                      <span id={`err-${k}`} className="mt-2 block text-[0.85rem] text-wine">
                        {errors[k]}
                      </span>
                    )}
                  </label>
                ))}
                <label className="block sm:col-span-2">
                  <span className="t-eyebrow mb-2 block text-muted">{t.note}</span>
                  <textarea
                    rows={3}
                    value={form.note}
                    placeholder={t.notePh}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full resize-none border-b border-line bg-transparent py-3 text-[1.05rem] outline-none placeholder:text-muted/70 focus:border-fg"
                  />
                </label>
                <label className="flex items-start gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    aria-invalid={errors.consent ? "true" : undefined}
                    aria-describedby={errors.consent ? "err-consent" : undefined}
                    className="mt-1 h-5 w-5 shrink-0 accent-[var(--wine)]"
                  />
                  <span className="text-[0.95rem]">
                    {t.consent}
                    {errors.consent && (
                      <span id="err-consent" className="mt-1 block text-[0.85rem] text-wine">
                        {errors.consent}
                      </span>
                    )}
                  </span>
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Nav */}
        <div className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-8">
          <button
            type="button"
            onClick={() => go((step - 1) as Step)}
            disabled={step === 0}
            className="min-h-12 rounded-full px-5 font-medium disabled:invisible"
          >
            ← {t.back}
          </button>
          {step < 3 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => go((step + 1) as Step)}
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-wine px-8 font-medium text-cream transition-colors duration-500 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-35"
            >
              {t.next} <span aria-hidden>→</span>
            </button>
          ) : (
            <button
              type="submit"
              form="booking-form"
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-wine px-8 font-medium text-cream transition-colors duration-500 hover:bg-ink"
            >
              {t.confirm} <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
      {Summary}
    </div>
  );
}
