import clsx from "clsx";

export function Stars({ value = 5, className, label }: { value?: number; className?: string; label?: string }) {
  return (
    <span className={clsx("inline-flex gap-0.5", className)} role="img" aria-label={label ?? `${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[1em] w-[1em]" aria-hidden>
          <path
            d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z"
            fill={i < Math.round(value) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      ))}
    </span>
  );
}
