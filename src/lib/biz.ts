import { site } from "./site";
import { type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

const hm = (h: number) => `${String(h).padStart(2, "0")}:00`;

/** The fictional salon as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "sr",
  name: site.legalName,
  shortName: site.name,
  tagline: null,
  area: site.address.district,
  phone: site.phoneHref.replace(/^tel:/, ""),
  phoneDisplay: site.phone,
  address: { street: site.address.street, city: site.address.city, region: "", postal: site.address.postal, full: `${site.address.street}, ${site.address.city}` },
  timezone: "Europe/Belgrade",
  hours: [0, 1, 2, 3, 4, 5, 6].map((day): DayHours => {
    const h = site.hours.find((x) => x.day === day);
    return { day, open: h ? hm(h.open) : null, close: h ? hm(h.close) : null };
  }),
  hoursSummary: "Uto–sub 9–21 h",
  rating: { ...site.rating },
  preview: false,
};
