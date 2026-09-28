import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

/** Infinite CSS marquee. Content is duplicated once; the copy is hidden from assistive tech. */
export function Marquee({ children, className, duration = 40, reverse }: { children: ReactNode; className?: string; duration?: number; reverse?: boolean }) {
  return (
    <div className={clsx("marquee flex overflow-hidden", className)}>
      <div
        className="marquee-track flex shrink-0 items-center"
        style={{ "--dur": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
