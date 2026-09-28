import Link from "next/link";
import clsx from "clsx";
import { JsonLd } from "./JsonLd";
import { graph, breadcrumbSchema } from "@/lib/schema";

/** Visible breadcrumb trail + BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items, className }: { items: { name: string; url: string }[]; className?: string }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={clsx("t-eyebrow text-muted", className)}>
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {items.map((it, i) => (
            <li key={it.url} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden>/</span>}
              {i < items.length - 1 ? (
                <Link href={it.url} className="link-draw hover:text-fg">
                  {it.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-fg">
                  {it.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={graph(breadcrumbSchema(items))} />
    </>
  );
}
