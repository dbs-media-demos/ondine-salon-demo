# Ondine (Scale by Noon demo)

- Niche: hair & beauty salon         (matches www.scalebynoon.com industry id: salons)
- Market / city: RS – Beograd (Dorćol)
- Languages: sr + en (Serbian Latin at `/`, English at `/en`, localized slugs, hreflang)
- Live URL: https://ondine-salon-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/ondine-salon-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/salon
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP (ScrollTrigger, SplitText), Lenis, three.js 0.187 (desktop only, own chunk)
- Palette: #0F0B0C ink · #F4EDE4 cream · #E8D3C7 blush · #C6A08A nude · #5A1A29 wine · #B89468 champagne   Fonts: Playfair Display 500 + italic (self-hosted subset; replaced Bodoni Moda on 2026-10-07, its hairlines were too thin), Hanken Grotesk
- Pages: 38 routes (19 per language) + 404. Home, Services + 7 service pages (cuts, colour & balayage, blow-dry & styling, keratin & treatments, nails, brows & lashes, bridal), Prices, Lookbook, Team, About, Gift cards, Reviews, FAQ, Booking, Contact, Privacy.
- Signature features:
  - 3D hair hero (desktop with a mouse): through the giant die-cut "ONDINE" a river of copper hair flows in a warm dark room, and one lock of the same hair pours in over the type and casts a soft shadow on the paper. Thousands of GPU strands with a hair light model (Kajiya-Kay: a white and a tinted highlight along each strand, darker inside the lock, clumping at the ends); the cursor combs through the lock and the light follows it; scrolling flies the camera through the "I" into the hair. Two canvases sandwich the SVG paper, so a preview's name gets the same scene. Code: `src/components/fx/hair/` (strands, hero scene, shade card, soft shadow).
  - Shade card ("Nađite svoju nijansu"): six colourist's swatch tresses on a brass rod (Ponoć, Bronza, Bakar, Med, Zlatni sat, Pesak), live 3D on desktop: the cursor brushes through them, scrolling stirs them, click or the buttons pick one, which swings into the light. The answer is real text from the price list: technique, time, "od" price, stylist and "Book this shade" (preselected in the booking flow). Data: `src/content/shades.ts`.
  - Stills for everyone else: `scripts/render-hair-stills.mjs` renders them from the live scenes (river behind the letters, the lock, the tresses) in headless Chrome; the server HTML shows them at once and the canvases fade in over them. three.js is fetched with `await import()` only after load, on `(min-width: 1024px) and (hover: hover) and (pointer: fine)`, no reduced motion, no Save-Data; frames stop when off screen.
  - Lookbook "Issue 07": 12 pinned full-screen spreads. Photos open from a small window, oversized italic titles rise letter by letter, an issue counter ticks, and each look links to the service behind it, morphing via React ViewTransition.
  - Real HTML price list (cenovnik) in RSD: 7 categories with scroll-spy tabs, a short/medium/long hair-length switch that rolls prices like an odometer, instant search with highlighting, and "Book" on every row. The whole list is also in the schema as an OfferCatalog.
  - Stylist cards: hover or tap fans the portrait out into four photos of that stylist's work, with specialties and "Book with Mila".
  - 4-step booking flow (service → stylist → day & time → details) with a live "ticket" summary, preselection from price-list and stylist links, validation and a stamped confirmation. Marked in code as where sredime.rs plugs in.
  - Also: gift-card builder with a 3D-tilt live preview, cursor-following service index, horizontal lookbook rail, video window that opens to full bleed, counter-scrolling Google-style reviews, live "Open now" badge (Belgrade time), stylised SVG map of Dorćol, full-screen menu with image previews, custom cursor, magnetic buttons.
- Phones (below 768 px or touch, `phone:` variant, `lib/motion.ts`): a different page from the same HTML. First screen: real style photo, Google rating, service + town headline, "from" price; bar with Call (showing the number) + Book. Order: prices, stylists, reviews, hours and map, then the rest (CSS `order`, desktop keeps its order). Nothing pinned; GSAP and Lenis are never downloaded, no video plays. Motion: tap feedback, one fade-and-rise per section (`PhoneMotion`), swipe rails, the hair-length switch and scissors that snip the rule above the price list (`SnipRule`). The 3D's places hold stills rendered from it: the hero's lock lies across the page under the first screen, and the shade card is a still of the tresses with the same shade buttons and answer (a dot marks the chosen tress). Zero bytes of three.js. Body text uses the system sans, so only the two Playfair files load. The concept badge sits in the footer's flow.
- Phone budget, 3D pass (2026-11-09, production build, 375 px, 4x CPU, slow 4G): LCP 1.52–1.56 s (the hero photo), TBT 114–149 ms, CLS 0, first-load JS 173 KB, three.js 0 bytes, 409 KB in total, 12 screens. Desktop: hero frames ~4 ms.
- Lighthouse (before the phone pass; mobile, home, live): P 84–89 / A 100 / BP 100 / SEO 69. SEO is 69 only because the demo is deliberately `noindex`; every other SEO audit passes, so it scores 100 with `NEXT_PUBLIC_NOINDEX=false`. Inner pages locally: prices P 93, service P 91, team P 89. Desktop: P 99 on home, prices and service pages. CLS 0.

## Portfolio copy
EN title: Ondine — hair & beauty atelier, Belgrade
EN one-liner (≤ 120 chars): An editorial salon site: a video-in-the-letters hero, a scroll-driven lookbook and a price list Google can read.
EN summary (2–3 sentences): A concept site for a premium hair and beauty atelier in Dorćol, Belgrade, built like a fashion magazine: a slow-motion video inside a giant serif masthead, a pinned full-screen lookbook and stylist cards that fan out into their work. Instead of the usual JPG price menu, every price is real, searchable HTML that updates by hair length and feeds structured data. Bilingual (Serbian/English), with booking in four steps.
SR title: Ondine — atelje za kosu i lepotu, Beograd
SR one-liner: Editorijalni sajt salona: video u slovima, lookbook koji se lista skrolom i cenovnik koji Google može da pročita.
SR summary: Konceptni sajt za premium frizerski salon u Dorćolu, urađen kao modni magazin: usporeni video unutar ogromnog natpisa, lookbook preko celog ekrana i kartice stilista koje se otvaraju u galeriju radova. Umesto cenovnika u JPG-u, sve cene su pravi tekst koji se pretražuje, menja po dužini kose i šalje Google-u kroz strukturirane podatke. Dvojezičan (srpski/engleski), sa zakazivanjem u četiri koraka.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png, handoff/mobile-home.png, handoff/scroll.mp4

## Notes
- The business is fictional: Strahinjića Bana 44 is a made-up number on a real street, the phone is `+381 11 000 0000`, and forms validate but send nothing.
- Photos come from Unsplash and video from Pexels, all downloaded locally and credited in `public/images/SOURCES.md`.
- The Vercel project is `ondine-salon-demo` on team "Dimitrije's projects", with no custom domain.
