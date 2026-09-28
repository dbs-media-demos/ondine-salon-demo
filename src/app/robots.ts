import type { MetadataRoute } from "next";
import { site, siteUrl } from "@/lib/site";

/** Concept site: disallow everything unless NEXT_PUBLIC_NOINDEX === "false". */
export default function robots(): MetadataRoute.Robots {
  if (site.noindex) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
