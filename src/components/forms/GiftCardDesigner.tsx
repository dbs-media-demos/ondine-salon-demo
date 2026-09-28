"use client";

import { useRef, useState, type FormEvent, type PointerEvent } from "react";
import clsx from "clsx";
import { Mark } from "@/components/brand/Logo";
import type { Locale } from "@/lib/i18n";
import { formatRsd } from "@/content/prices";

const AMOUNTS = [5000, 10000, 15000, 25000];
const DESIGNS = [
  { id: "wine", bg: "#5a1a29", fg: "#f4ede4", accent: "#e8d3c7" },
  { id: "blush", bg: "#e8d3c7", fg: "#0f0b0c", accent: "#5a1a29" },
  { id: "ink", bg: "#0f0b0c", fg: "#f4ede4", accent: "#b89468" },
] as const;

const T = {
  sr: {
    amount: "Iznos",
    custom: "Drugi iznos",
    design: "Dizajn",
    designs: { wine: "Vino", blush: "Puder", ink: "Ponoć" },
    to: "Za koga",
    from: "Od koga",
    message: "Poruka",
    messagePh: "Srećan rođendan! Vreme je za novu boju…",
    delivery: "Isporuka",
    email: "E-mailom kao PDF (odmah)",
    pickup: "Preuzimanje u salonu (štampana kartica u koverti)",
    yourEmail: "Vaš e-mail",
    buy: "Naruči vaučer",
    card: "Poklon vaučer",
    valid: "Važi 12 meseci · sve usluge",
    errors: { amount: "Izaberite iznos od najmanje 3.000 RSD.", to: "Unesite ime primaoca.", email: "Unesite ispravan e-mail." },
    doneTitle: "Vaučer je spreman.",
    doneText: "Ovo je demo sajt, pa ništa nije naplaćeno ni poslato. Pravi salon bi ovde povezao online plaćanje karticom ili IPS QR kod.",
    again: "Napravi još jedan",
    for: "za",
  },
  en: {
    amount: "Amount",
    custom: "Other amount",
    design: "Design",
    designs: { wine: "Wine", blush: "Powder", ink: "Midnight" },
    to: "To",
    from: "From",
    message: "Message",
    messagePh: "Happy birthday! Time for a new colour…",
    delivery: "Delivery",
    email: "By email as a PDF (instant)",
    pickup: "Pick up at the salon (printed card in an envelope)",
    yourEmail: "Your email",
    buy: "Order gift card",
    card: "Gift card",
    valid: "Valid 12 months · all services",
    errors: { amount: "Choose an amount of at least 3,000 RSD.", to: "Enter the recipient's name.", email: "Enter a valid email." },
    doneTitle: "Your gift card is ready.",
    doneText: "This is a demo site, so nothing was charged or sent. A real salon would connect card payments or an IPS QR code here.",
    again: "Make another",
    for: "for",
  },
};

/** Gift-card builder with a live 3D-tilting preview. Validates, never sends. */
export function GiftCardDesigner({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [amount, setAmount] = useState(10000);
  const [custom, setCustom] = useState("");
  const [design, setDesign] = useState<(typeof DESIGNS)[number]["id"]>("wine");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [delivery, setDelivery] = useState<"email" | "pickup">("email");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const D = DESIGNS.find((x) => x.id === design)!;
  const value = custom ? Number(custom.replace(/\D/g, "")) : amount;

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!value || value < 3000) er.amount = t.errors.amount;
    if (!to.trim()) er.to = t.errors.to;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) er.email = t.errors.email;
    setErrors(er);
    if (Object.keys(er).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setDone(true);
  };

  const input = "w-full border-b border-line bg-transparent py-3 text-[1.05rem] outline-none focus:border-fg aria-[invalid=true]:border-wine";

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
      {/* Preview */}
      <div className="lg:sticky lg:top-28" style={{ perspective: 1200 }} onPointerMove={tilt} onPointerLeave={() => card.current && (card.current.style.transform = "")}>
        <div
          ref={card}
          className="relative aspect-[1.6/1] w-full overflow-hidden rounded-[18px] p-[6%] shadow-[0_40px_80px_-30px_rgba(15,11,12,0.55)] transition-[transform,background-color,color] duration-500 ease-out"
          style={{ backgroundColor: D.bg, color: D.fg, transformStyle: "preserve-3d" }}
          aria-hidden
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
            style={{ background: "radial-gradient(circle at var(--gx,30%) var(--gy,20%), rgba(255,255,255,0.7), transparent 45%)" }}
          />
          <Mark className="absolute -right-[12%] -top-[20%] h-[120%] w-auto opacity-[0.09]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="font-serif text-[clamp(1.4rem,3vw,2.2rem)] tracking-[0.2em]">ONDINE</p>
              <p className="t-eyebrow text-[0.6rem]" style={{ color: D.accent }}>
                {t.card}
              </p>
            </div>
            <div>
              <p className="font-serif text-[clamp(2.4rem,6vw,4.6rem)] leading-none">{value ? formatRsd(value, locale) : "—"}</p>
              <p className="mt-3 truncate font-serif text-[clamp(1rem,1.6vw,1.3rem)] italic">
                {to ? `${t.for} ${to}` : " "}
                {from ? ` · ${from}` : ""}
              </p>
              {msg && <p className="mt-1 line-clamp-2 text-[0.8rem] opacity-80">{msg}</p>}
            </div>
            <p className="t-eyebrow text-[0.55rem] opacity-70">{t.valid}</p>
          </div>
        </div>
      </div>

      {done ? (
        <div aria-live="polite">
          <h2 className="t-h2">{t.doneTitle}</h2>
          <p className="t-lead mt-6 text-muted">{t.doneText}</p>
          <button type="button" onClick={() => setDone(false)} className="mt-8 inline-flex min-h-12 items-center rounded-full border border-line px-7 font-medium hover:border-fg">
            {t.again}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-10">
          <fieldset>
            <legend className="t-eyebrow mb-4 text-muted">{t.amount}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {AMOUNTS.map((a) => (
                <label key={a} className={clsx("flex min-h-12 cursor-pointer items-center justify-center rounded-full border text-[0.95rem] transition-colors", !custom && amount === a ? "border-ink bg-ink text-cream" : "border-line hover:border-fg")}>
                  <input
                    type="radio"
                    name="amount"
                    className="sr-only"
                    checked={!custom && amount === a}
                    onChange={() => {
                      setAmount(a);
                      setCustom("");
                    }}
                  />
                  {formatRsd(a, locale).replace(" RSD", "")}
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="sr-only">{t.custom}</span>
              <input
                inputMode="numeric"
                placeholder={`${t.custom} (RSD)`}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                aria-invalid={errors.amount ? "true" : undefined}
                aria-describedby={errors.amount ? "gc-amount" : undefined}
                className={input}
              />
              {errors.amount && (
                <span id="gc-amount" className="mt-2 block text-[0.85rem] text-wine">
                  {errors.amount}
                </span>
              )}
            </label>
          </fieldset>

          <fieldset>
            <legend className="t-eyebrow mb-4 text-muted">{t.design}</legend>
            <div className="flex gap-3">
              {DESIGNS.map((x) => (
                <label key={x.id} className="cursor-pointer text-center text-[0.85rem]">
                  <input type="radio" name="design" className="peer sr-only" checked={design === x.id} onChange={() => setDesign(x.id)} />
                  <span
                    className={clsx("mb-2 block h-12 w-20 rounded-lg border-2 transition-transform peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wine", design === x.id ? "scale-105 border-ink" : "border-transparent")}
                    style={{ backgroundColor: x.bg }}
                  />
                  {t.designs[x.id]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="t-eyebrow mb-1 block text-muted">{t.to}</span>
              <input value={to} onChange={(e) => setTo(e.target.value)} maxLength={40} aria-invalid={errors.to ? "true" : undefined} aria-describedby={errors.to ? "gc-to" : undefined} className={input} />
              {errors.to && (
                <span id="gc-to" className="mt-2 block text-[0.85rem] text-wine">
                  {errors.to}
                </span>
              )}
            </label>
            <label className="block">
              <span className="t-eyebrow mb-1 block text-muted">{t.from}</span>
              <input value={from} onChange={(e) => setFrom(e.target.value)} maxLength={40} className={input} />
            </label>
            <label className="block sm:col-span-2">
              <span className="t-eyebrow mb-1 block text-muted">{t.message}</span>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={120} rows={2} placeholder={t.messagePh} className={clsx(input, "resize-none placeholder:text-muted/70")} />
            </label>
          </div>

          <fieldset>
            <legend className="t-eyebrow mb-4 text-muted">{t.delivery}</legend>
            {(["email", "pickup"] as const).map((k) => (
              <label key={k} className="flex min-h-11 cursor-pointer items-center gap-3">
                <input type="radio" name="delivery" checked={delivery === k} onChange={() => setDelivery(k)} className="h-4 w-4 accent-[var(--wine)]" />
                {t[k]}
              </label>
            ))}
          </fieldset>

          <label className="block">
            <span className="t-eyebrow mb-1 block text-muted">{t.yourEmail}</span>
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "gc-email" : undefined} className={input} />
            {errors.email && (
              <span id="gc-email" className="mt-2 block text-[0.85rem] text-wine">
                {errors.email}
              </span>
            )}
          </label>

          <button type="submit" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-wine px-8 font-medium text-cream transition-colors duration-500 hover:bg-ink">
            {t.buy} · {value ? formatRsd(value, locale) : ""} <span aria-hidden>→</span>
          </button>
        </form>
      )}
    </div>
  );
}
