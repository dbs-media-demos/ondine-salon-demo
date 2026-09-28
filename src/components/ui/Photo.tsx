import Image from "next/image";
import clsx from "clsx";
import { img, type ImgKey } from "@/content/images";

type PhotoProps = {
  k: ImgKey;
  alt: string;
  sizes: string;
  className?: string;
  /** Fill the (positioned) parent instead of using intrinsic size. */
  fill?: boolean;
  preload?: boolean;
  quality?: 60 | 75 | 85;
  position?: string;
};

/** next/image with the intrinsic size of our local photo library. */
export function Photo({ k, alt, sizes, className, fill = true, preload, quality = 75, position }: PhotoProps) {
  const p = img[k];
  return fill ? (
    <Image
      src={p.src}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      preload={preload}
      className={clsx("object-cover", className)}
      style={position ? { objectPosition: position } : undefined}
    />
  ) : (
    <Image src={p.src} alt={alt} width={p.w} height={p.h} sizes={sizes} quality={quality} preload={preload} className={className} />
  );
}
