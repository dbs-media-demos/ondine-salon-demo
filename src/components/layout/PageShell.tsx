import { ViewTransition, type ReactNode } from "react";
import clsx from "clsx";

/**
 * Wraps every page. Route changes animate through CSS view transitions:
 * the old page lifts away, the new one wipes up from below (globals.css).
 */
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className={clsx("relative", className)}>
        {children}
      </main>
    </ViewTransition>
  );
}
