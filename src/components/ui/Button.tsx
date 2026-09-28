import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "solid" | "outline" | "light" | "ink";

const styles: Record<Variant, string> = {
  solid: "bg-accent text-accent-fg hover:bg-fg hover:text-bg",
  outline: "border border-current hover:bg-fg hover:text-bg hover:border-fg",
  light: "bg-cream text-ink hover:bg-blush",
  ink: "bg-ink text-cream hover:bg-wine",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
  "aria-label"?: string;
};

/** Pill link-button. Internal links use next/link, tel:/mailto:/http use <a>. */
export function Button({ href, children, variant = "solid", className, magnetic = true, arrow = true, ...rest }: Props) {
  const cls = clsx(
    "group/btn relative inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-7 text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-500 ease-[var(--ease-out-expo)]",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <span aria-hidden className="relative inline-flex h-4 w-4 overflow-hidden">
          <span className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-full">→</span>
          <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0">→</span>
        </span>
      )}
    </>
  );
  const external = /^(https?:|tel:|mailto:)/.test(href);
  const link = external ? (
    <a href={href} className={cls} aria-label={rest["aria-label"]} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} aria-label={rest["aria-label"]}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
