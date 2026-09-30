"use client";

import { useState, useSyncExternalStore } from "react";
import { agency, agencyUrl } from "@/lib/site";

const KEY = "ondine-demo-pill";

/** Small "Concept site by Scale by Noon" badge, dismissible for this session. */
export function DemoPill({ label, dismissLabel }: { label: string; dismissLabel: string }) {
  const [hidden, setHidden] = useState(false);
  const dismissed = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem(KEY) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );

  if (hidden || dismissed) return null;

  return (
    <div className="fixed bottom-[5.25rem] right-3 z-[120] flex items-center overflow-hidden rounded-full border border-ink/10 bg-cream/90 text-[0.75rem] text-ink shadow-[0_8px_30px_-12px_rgba(15,11,12,0.35)] backdrop-blur md:bottom-5 md:right-5">
      <a
        href={agencyUrl}
        target="_blank"
        rel="noopener"
        aria-label={`${label} ↗`}
        className="flex min-h-11 items-center gap-2 py-2 pl-4 pr-2 font-medium hover:text-wine"
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-wine" />
        <span className="hidden whitespace-nowrap sm:inline">{label}</span>
        <span className="whitespace-nowrap sm:hidden">{agency.name}</span>
        <span aria-hidden>↗</span>
      </a>
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        aria-label={dismissLabel}
        className="grid min-h-11 w-10 place-items-center text-ink/60 hover:text-ink"
      >
        ×
      </button>
    </div>
  );
}
