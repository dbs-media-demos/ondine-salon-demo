"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const DIGITS = "0123456789";

/**
 * Price that rolls digit by digit (like an odometer) when it changes.
 * Renders plain text until the first change, so long price lists stay light.
 */
export function Odometer({ value, className }: { value: string; className?: string }) {
  const prev = useRef(value);
  const [changed, setChanged] = useState(false);
  // Old value, aligned to the new length; non-null only for the first frame of a change.
  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    if (value === prev.current) return;
    setChanged(true);
    setFrom(prev.current.padStart(value.length, " ").slice(-value.length));
    prev.current = value;
    // Mount the columns at the old digits, then roll to the new ones.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setFrom(null));
    });
    return () => cancelAnimationFrame(id);
  }, [value]);

  if (!changed) return <span className={clsx("tabular-nums", className)}>{value}</span>;

  const chars = value.split("");
  return (
    <span className={clsx("relative inline-flex tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {chars.map((c, i) => {
          const key = `${chars.length - i}-${/\d/.test(c) ? "d" : c}`;
          if (!/\d/.test(c)) return <span key={key}>{c}</span>;
          const old = from?.[i];
          const n = old && /\d/.test(old) ? Number(old) : Number(c);
          return (
            <span key={key} className="relative inline-block h-[1.1em] overflow-hidden leading-[1.1em]">
              <span className="invisible">0</span>
              <span
                className={clsx("absolute left-0 top-0 flex flex-col", from === null && "transition-transform duration-[900ms] ease-[var(--ease-out-expo)]")}
                style={{ transform: `translateY(${-n * 1.1}em)`, transitionDelay: `${(chars.length - i) * 35}ms` }}
              >
                {DIGITS.split("").map((d) => (
                  <span key={d} className="h-[1.1em]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
