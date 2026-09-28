import clsx from "clsx";

/** Native <details> accordion: works without JS, animated with CSS grid rows. */
export function FaqList({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={clsx("border-t border-line", className)}>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-line">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-serif text-[clamp(1.25rem,1.8vw,1.7rem)] leading-tight">{f.q}</span>
            <span
              aria-hidden
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition-colors duration-500 group-open:bg-fg group-open:text-bg"
            >
              <span className="absolute h-px w-3.5 bg-current" />
              <span className="absolute h-3.5 w-px bg-current transition-transform duration-500 group-open:rotate-90 group-open:scale-0" />
            </span>
          </summary>
          <p className="max-w-3xl pb-8 pr-14 text-[1.05rem] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
