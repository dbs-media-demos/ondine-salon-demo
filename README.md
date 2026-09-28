# Ondine — hair & beauty atelier (DBS Media concept site)

A fictional premium salon in Dorćol, Belgrade, built by DBS Media as a portfolio demo. Serbian (Latin) at `/`, English at `/en`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

- **Stack:** Next.js 16 (App Router, Turbopack), React 19.2, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText) + Lenis.
- **Content:** `src/content/*` (services, bilingual price list in RSD, team, lookbook, reviews, FAQ). UI strings in `src/i18n/dictionary.ts`.
- **Routing:** two root layouts, `src/app/(sr)` and `src/app/(en)/en`, with localized slugs from `src/lib/routes.ts`; views in `src/views`.
- **Indexing:** the demo is `noindex` (meta, header and robots.txt) unless `NEXT_PUBLIC_NOINDEX=false`.
- **Booking:** `src/components/booking/BookingFlow.tsx` is UI only — a real client would connect sredime.rs (or similar) there.
- **Media credits:** `public/images/SOURCES.md` (Unsplash + Pexels).

See `DEMO.md` for the portfolio handoff.
