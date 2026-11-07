"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isPhone, prefersReducedMotion } from "@/lib/motion";

/**
 * All the scroll motion a phone gets: each section's content fades and rises once as it arrives,
 * and the scissors above the price list snip once. Only content still below the fold is ever
 * hidden, after hydration, so nothing on the first screen fades in and everything shows without JS.
 */
export function PhoneMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPhone() || prefersReducedMotion()) return;

    const rise = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          rise.unobserve(e.target);
          const el = e.target.firstElementChild;
          if (!el) continue;
          el.classList.remove("rise-wait");
          el.classList.add("rise-in");
          el.addEventListener("animationend", () => el.classList.remove("rise-in"), { once: true });
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const fold = window.innerHeight * 0.92;
    document.querySelectorAll("main section, footer").forEach((section) => {
      // Nested sections (price categories) belong to the section around them
      if (section.parentElement?.closest("main section")) return;
      const el = section.firstElementChild;
      if (!el || section.getBoundingClientRect().top <= fold) return;
      el.classList.add("rise-wait");
      rise.observe(section);
    });

    const snip = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          snip.unobserve(e.target);
          e.target.classList.add("snip-go");
        }
      },
      { threshold: 1 },
    );
    document.querySelectorAll("[data-snip]").forEach((el) => snip.observe(el));

    return () => {
      rise.disconnect();
      snip.disconnect();
    };
  }, [pathname]);

  return null;
}
