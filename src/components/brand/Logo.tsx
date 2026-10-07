import clsx from "clsx";
import { LOGO } from "./logo-paths";

/**
 * Ondine wordmark. The O is the mark: a serif "O" crossed by a single hairline
 * wave (ondine = water spirit, hair in motion). The wave draws itself on load.
 */
export function Logo({ className, animate = false, title = "Ondine" }: { className?: string; animate?: boolean; title?: string }) {
  return (
    <svg viewBox={`-200 -60 ${LOGO.width + 260} 1640`} className={clsx("block", className)} role="img" aria-label={title} fill="currentColor">
      <path d={LOGO.o} />
      <path
        d={LOGO.wave}
        fill="none"
        stroke="currentColor"
        strokeWidth={46}
        strokeLinecap="round"
        pathLength={1}
        className={animate ? "logo-wave" : undefined}
      />
      <path d={LOGO.rest} />
    </svg>
  );
}

/** The O + wave on its own (favicon, badges, loaders). */
export function Mark({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox={`${LOGO.oWidth / 2 - 971} -60 1942 1640`} className={clsx("block", className)} aria-hidden fill="currentColor">
      <path d={LOGO.o} />
      <path
        d={LOGO.wave}
        fill="none"
        stroke="currentColor"
        strokeWidth={60}
        strokeLinecap="round"
        pathLength={1}
        className={animate ? "logo-wave" : undefined}
      />
    </svg>
  );
}
