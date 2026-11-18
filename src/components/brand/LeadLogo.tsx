import clsx from "clsx";
import type { CSSProperties } from "react";
import { prepLeadLogo } from "@/lib/lead-logo";

/**
 * A preview business's own logo, coloured by currentColor (so it follows the header's light and dark
 * states) and sized by its viewBox: give it a height (header) or a width (footer, loader).
 */
export function LeadLogo({ svg, label, className, style }: { svg: string; label?: string; className?: string; style?: CSSProperties }) {
  const logo = prepLeadLogo(svg);
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={clsx("lead-logo", className)}
      style={{ "--logo-a": logo.aspect, ...style } as CSSProperties}
      dangerouslySetInnerHTML={{ __html: logo.svg }}
    />
  );
}
