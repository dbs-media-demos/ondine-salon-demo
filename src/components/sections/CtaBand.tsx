import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "@/components/ui/Reveal";
import type { ImgKey } from "@/content/images";

/** Wine-coloured booking band with a drifting photo — the strong CTA on inner pages. */
export function CtaBand({ title, text, href, label, phone, phoneHref, image = "interior-mirror" }: { title: React.ReactNode; text: string; href: string; label: string; phone: string; phoneHref: string; image?: ImgKey }) {
  return (
    <section className="theme-wine relative overflow-hidden">
      <div className="wrap grid items-center gap-12 py-24 md:grid-cols-[1.3fr_0.7fr] md:py-32">
        <div>
          <SplitReveal className="t-h1 max-w-[13ch]">{title}</SplitReveal>
          <p className="t-lead mt-8 max-w-lg text-muted">{text}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={href} variant="light">
              {label}
            </Button>
            <Button href={phoneHref} variant="outline" arrow={false}>
              {phone}
            </Button>
          </div>
        </div>
        <Parallax className="hidden aspect-[3/4] md:block" amount={16}>
          <div className="absolute inset-0">
            <Photo k={image} alt="" sizes="30vw" />
          </div>
        </Parallax>
      </div>
    </section>
  );
}
