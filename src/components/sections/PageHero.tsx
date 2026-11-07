import type { ReactNode } from "react";
import clsx from "clsx";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";
import type { ImgKey } from "@/content/images";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: { name: string; url: string }[];
  image?: ImgKey;
  imageAlt?: string;
  position?: string;
  children?: ReactNode;
  theme?: "cream" | "ink" | "blush";
};

/**
 * Inner-page hero. Everything above the fold animates with CSS only
 * (anim-heading / anim-fade / anim-img) so it paints immediately.
 */
export function PageHero({ eyebrow, title, lead, crumbs, image, imageAlt, position, children, theme = "cream" }: Props) {
  return (
    <section className={clsx(`theme-${theme}`, "relative overflow-hidden pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-24 phone:pb-10 phone:pt-[calc(var(--header-h)+1.25rem)]")}>
      <div className={clsx("wrap grid gap-12 phone:gap-6", image && "lg:grid-cols-[1.25fr_0.75fr] lg:items-end phone:grid-cols-1")}>
        <div>
          <Breadcrumbs items={crumbs} className="anim-fade mb-10 md:mb-14 phone:mb-5" />
          <p className="t-eyebrow anim-fade mb-6 text-accent phone:mb-2" style={{ ["--d" as string]: "0.1s" }}>
            {eyebrow}
          </p>
          <h1 className="t-h1 anim-heading max-w-[14ch]" style={{ ["--d" as string]: "0.1s" }}>
            {title}
          </h1>
          {lead && (
            <div className="t-lead anim-fade mt-8 max-w-xl text-muted phone:mt-3" style={{ ["--d" as string]: "0.35s" }}>
              {lead}
            </div>
          )}
          {children && (
            <div className="anim-fade mt-10 phone:mt-5" style={{ ["--d" as string]: "0.5s" }}>
              {children}
            </div>
          )}
        </div>
        {image && (
          <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-[3/4] phone:aspect-[4/3]">
            <div className="anim-img absolute inset-0" style={{ ["--d" as string]: "0.15s" }}>
              <Photo k={image} alt={imageAlt ?? ""} sizes="(min-width: 1024px) 36vw, 100vw" preload quality={75} position={position} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
