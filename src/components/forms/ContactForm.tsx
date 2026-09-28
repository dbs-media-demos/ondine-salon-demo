"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";

const T = {
  sr: {
    name: "Ime",
    email: "E-mail",
    phone: "Telefon (nije obavezno)",
    topic: "Tema",
    topics: ["Pitanje o usluzi", "Venčanje / događaj", "Poklon vaučer", "Saradnja", "Nešto drugo"],
    message: "Poruka",
    send: "Pošalji poruku",
    errors: { name: "Unesite ime.", email: "Unesite ispravan e-mail.", message: "Poruka treba da ima bar 10 karaktera." },
    doneTitle: "Poruka je stigla.",
    doneText: "Odgovaramo u toku radnog dana. (Demo sajt — poruka zapravo nije poslata.)",
    again: "Pošalji novu poruku",
  },
  en: {
    name: "Name",
    email: "Email",
    phone: "Phone (optional)",
    topic: "Topic",
    topics: ["Question about a service", "Wedding / event", "Gift card", "Collaboration", "Something else"],
    message: "Message",
    send: "Send message",
    errors: { name: "Please enter your name.", email: "Please enter a valid email.", message: "Your message should be at least 10 characters." },
    doneTitle: "Message received.",
    doneText: "We reply within one working day. (Demo site — nothing was actually sent.)",
    again: "Send another message",
  },
};

/** Contact form: validates and shows a success state; sends nothing (concept site). */
export function ContactForm({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [v, setV] = useState({ name: "", email: "", phone: "", topic: t.topics[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!v.name.trim()) er.name = t.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) er.email = t.errors.email;
    if (v.message.trim().length < 10) er.message = t.errors.message;
    setErrors(er);
    if (Object.keys(er).length) {
      (e.currentTarget as HTMLFormElement).querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setDone(true);
  };

  if (done)
    return (
      <div aria-live="polite" className="py-10">
        <p className="t-h2">{t.doneTitle}</p>
        <p className="t-lead mt-6 text-muted">{t.doneText}</p>
        <button type="button" onClick={() => setDone(false)} className="mt-8 inline-flex min-h-12 items-center rounded-full border border-line px-7 font-medium hover:border-fg">
          {t.again}
        </button>
      </div>
    );

  const input = "w-full border-b border-line bg-transparent py-3 text-[1.05rem] outline-none focus:border-fg aria-[invalid=true]:border-wine";
  const field = (k: "name" | "email" | "phone", label: string, type: string, ac: string) => (
    <label className="block">
      <span className="t-eyebrow mb-1 block text-muted">{label}</span>
      <input
        type={type}
        autoComplete={ac}
        value={v[k]}
        onChange={(e) => setV({ ...v, [k]: e.target.value })}
        aria-invalid={errors[k] ? "true" : undefined}
        aria-describedby={errors[k] ? `cf-${k}` : undefined}
        className={input}
      />
      {errors[k] && (
        <span id={`cf-${k}`} className="mt-2 block text-[0.85rem] text-wine">
          {errors[k]}
        </span>
      )}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 sm:grid-cols-2">
      {field("name", t.name, "text", "name")}
      {field("email", t.email, "email", "email")}
      {field("phone", t.phone, "tel", "tel")}
      <label className="block">
        <span className="t-eyebrow mb-1 block text-muted">{t.topic}</span>
        <select value={v.topic} onChange={(e) => setV({ ...v, topic: e.target.value })} className={clsx(input, "min-h-12")}>
          {t.topics.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="t-eyebrow mb-1 block text-muted">{t.message}</span>
        <textarea
          rows={5}
          value={v.message}
          onChange={(e) => setV({ ...v, message: e.target.value })}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "cf-message" : undefined}
          className={clsx(input, "resize-none")}
        />
        {errors.message && (
          <span id="cf-message" className="mt-2 block text-[0.85rem] text-wine">
            {errors.message}
          </span>
        )}
      </label>
      <div>
        <button type="submit" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-wine px-8 font-medium text-cream transition-colors duration-500 hover:bg-ink">
          {t.send} <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
