import clsx from "clsx";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "@/components/ui/Reveal";
import type { ImgKey } from "@/content/images";

// Editorial rhythm: tall, square, tall, wide… with offset columns.
const shapes = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/5]", "aspect-square"];

/** Three offset columns of photos, each unmasking and drifting at its own pace. */
export function Gallery({ items, className }: { items: { key: ImgKey; alt: string }[]; className?: string }) {
  const cols: { key: ImgKey; alt: string; i: number }[][] = [[], [], []];
  items.forEach((it, i) => cols[i % 3].push({ ...it, i }));
  return (
    <div className={clsx("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6", className)}>
      {cols.map((col, ci) => (
        <div key={ci} className={clsx("space-y-3 md:space-y-6", ci === 1 && "pt-12 md:pt-32", ci === 2 && "hidden md:block md:pt-12")}>
          {col.map((it) => (
            <Parallax key={it.key} amount={ci === 1 ? 16 : 10} className={shapes[it.i % shapes.length]}>
              <div className="absolute inset-0">
                <Photo k={it.key} alt={it.alt} sizes="(min-width: 768px) 32vw, 50vw" />
              </div>
            </Parallax>
          ))}
        </div>
      ))}
      {/* Phones: the third column's photos join the first two. */}
      <div className="col-span-2 grid grid-cols-2 gap-3 md:hidden">
        {cols[2].map((it) => (
          <div key={it.key} className="relative aspect-square overflow-hidden">
            <Photo k={it.key} alt={it.alt} sizes="50vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
