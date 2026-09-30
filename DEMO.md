# Ondine (Scale by Noon demo)

- Niche: hair & beauty salon         (matches www.scalebynoon.com industry id: salons)
- Market / city: RS – Beograd (Dorćol)
- Languages: sr + en (Serbian Latin at `/`, English at `/en`, localized slugs, hreflang)
- Live URL: https://ondine-salon-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/ondine-salon-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/salon
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP (ScrollTrigger, SplitText), Lenis
- Palette: #0F0B0C ink · #F4EDE4 cream · #E8D3C7 blush · #C6A08A nude · #5A1A29 wine · #B89468 champagne   Fonts: Bodoni Moda (self-hosted subset, optical-size axis), Hanken Grotesk
- Pages: 38 routes (19 per language) + 404. Home, Services + 7 service pages (cuts, colour & balayage, blow-dry & styling, keratin & treatments, nails, brows & lashes, bridal), Prices, Lookbook, Team, About, Gift cards, Reviews, FAQ, Booking, Contact, Privacy.
- Signature features:
  - Masthead hero: a slow-motion hair video plays inside a giant Didone "ONDINE"; scrolling flies the camera into the "I" until the video fills the screen (on phones the masthead runs up the edge like a magazine spine).
  - Lookbook "Issue 07": 12 pinned full-screen spreads. Photos open from a small window, oversized italic titles rise letter by letter, an issue counter ticks, and each look links to the service behind it, morphing via React ViewTransition.
  - Real HTML price list (cenovnik) in RSD: 7 categories with scroll-spy tabs, a short/medium/long hair-length switch that rolls prices like an odometer, instant search with highlighting, and "Book" on every row. The whole list is also in the schema as an OfferCatalog.
  - Stylist cards: hover or tap fans the portrait out into four photos of that stylist's work, with specialties and "Book with Mila".
  - 4-step booking flow (service → stylist → day & time → details) with a live "ticket" summary, preselection from price-list and stylist links, validation and a stamped confirmation. Marked in code as where sredime.rs plugs in.
  - Also: gift-card builder with a 3D-tilt live preview, cursor-following service index, horizontal lookbook rail, video window that opens to full bleed, counter-scrolling Google-style reviews, live "Open now" badge (Belgrade time), stylised SVG map of Dorćol, full-screen menu with image previews, custom cursor, magnetic buttons.
- Lighthouse (mobile, home, live): P 84–89 / A 100 / BP 100 / SEO 69. SEO is 69 only because the demo is deliberately `noindex`; every other SEO audit passes, so it scores 100 with `NEXT_PUBLIC_NOINDEX=false`. Inner pages locally: prices P 93, service P 91, team P 89. Desktop: P 99 on home, prices and service pages. CLS 0.

## Portfolio copy
EN title: Ondine — hair & beauty atelier, Belgrade
EN one-liner (≤ 120 chars): An editorial salon site: a video-in-the-letters hero, a scroll-driven lookbook and a price list Google can read.
EN summary (2–3 sentences): A concept site for a premium hair and beauty atelier in Dorćol, Belgrade, built like a fashion magazine: a slow-motion video inside a giant Didone masthead, a pinned full-screen lookbook and stylist cards that fan out into their work. Instead of the usual JPG price menu, every price is real, searchable HTML that updates by hair length and feeds structured data. Bilingual (Serbian/English), with booking in four steps.
SR title: Ondine — atelje za kosu i lepotu, Beograd
SR one-liner: Editorijalni sajt salona: video u slovima, lookbook koji se lista skrolom i cenovnik koji Google može da pročita.
SR summary: Konceptni sajt za premium frizerski salon u Dorćolu, urađen kao modni magazin: usporeni video unutar ogromnog natpisa, lookbook preko celog ekrana i kartice stilista koje se otvaraju u galeriju radova. Umesto cenovnika u JPG-u, sve cene su pravi tekst koji se pretražuje, menja po dužini kose i šalje Google-u kroz strukturirane podatke. Dvojezičan (srpski/engleski), sa zakazivanjem u četiri koraka.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png, handoff/mobile-home.png, handoff/scroll.mp4

## Notes
- The business is fictional: Strahinjića Bana 44 is a made-up number on a real street, the phone is `+381 11 000 0000`, and forms validate but send nothing.
- Photos come from Unsplash and video from Pexels, all downloaded locally and credited in `public/images/SOURCES.md`.
- The Vercel project is `ondine-salon-demo` on team "Dimitrije's projects", with no custom domain.
