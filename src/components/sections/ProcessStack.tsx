import clsx from "clsx";

/**
 * Steps as sticky cards that stack on top of each other while scrolling
 * (pure CSS sticky — no JS, works everywhere).
 */
export function ProcessStack({ steps, className }: { steps: { title: string; text: string }[]; className?: string }) {
  const tones = ["bg-cream-2", "bg-blush", "bg-nude text-ink", "bg-ink text-cream"];
  return (
    <ol className={clsx("relative", className)}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={clsx(
            "sticky flex min-h-[46vh] flex-col justify-between gap-10 border-t border-ink/10 p-8 shadow-[0_-20px_40px_-30px_rgba(15,11,12,0.4)] md:min-h-[52vh] md:p-12",
            tones[i % tones.length],
          )}
          style={{ top: `calc(var(--header-h) + ${i * 2.2}rem)` }}
        >
          <div className="flex items-start justify-between gap-6">
            <span className="font-serif text-[clamp(4rem,9vw,8rem)] italic leading-[0.8] opacity-90">{String(i + 1).padStart(2, "0")}</span>
            <span className="t-eyebrow opacity-70">
              {i + 1} / {steps.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
            <h3 className="t-h2">{s.title}</h3>
            <p className="t-lead max-w-md opacity-80">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
