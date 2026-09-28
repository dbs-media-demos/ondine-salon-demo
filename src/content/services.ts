import type { Localized } from "@/lib/i18n";
import type { ImgKey } from "./images";

export type Service = {
  id: string;
  slug: Localized<string>;
  num: string;
  title: Localized<string>;
  /** Short word used in menus and marquees. */
  short: Localized<string>;
  tagline: Localized<string>;
  intro: Localized<string[]>;
  includes: Localized<string[]>;
  duration: Localized<string>;
  from: number;
  image: ImgKey;
  alt: Localized<string>;
  gallery: { key: ImgKey; alt: Localized<string> }[];
  video?: { src: string; poster: string };
  /** Price-list categories that belong to this service. */
  priceCategories: string[];
  steps: Localized<{ title: string; text: string }[]>;
  faq: Localized<{ q: string; a: string }[]>;
  stylists: string[];
};

export const services: Service[] = [
  {
    id: "cuts",
    slug: { sr: "sisanje", en: "haircuts" },
    num: "01",
    title: { sr: "Šišanje", en: "Haircuts" },
    short: { sr: "Šišanje", en: "Cuts" },
    tagline: {
      sr: "Precizan rez koji pada sam od sebe — i tri nedelje kasnije.",
      en: "A precise cut that falls into place on its own — three weeks later, too.",
    },
    intro: {
      sr: [
        "Svako šišanje počinje razgovorom od deset minuta: kako nosite kosu radnim danom, koliko vremena imate ujutru, šta vam je smetalo kod prethodnog reza. Tek onda uzimamo makaze.",
        "Šišamo na suvo i na mokro, u zavisnosti od strukture kose. Kovrdže sečemo pramen po pramen, a bob i ravne linije proveravamo tek kada je kosa potpuno osušena — zato linija ostaje čista i kad se kosa sama osuši kod kuće.",
      ],
      en: [
        "Every cut starts with a ten-minute conversation: how you wear your hair on a workday, how much time you have in the morning, what bothered you about your last cut. Only then do we pick up the scissors.",
        "We cut wet or dry depending on your hair. Curls are cut curl by curl, and bobs and blunt lines are checked once the hair is fully dry — so the line stays clean when it air-dries at home.",
      ],
    },
    includes: {
      sr: ["Konsultacija i analiza strukture kose", "Pranje profesionalnim italijanskim preparatima", "Masaža vlasišta", "Šišanje i završno feniranje", "Savet za styling kod kuće"],
      en: ["Consultation and hair-texture analysis", "Wash with professional Italian products", "Scalp massage", "Cut and finishing blow-dry", "At-home styling advice"],
    },
    duration: { sr: "60–75 min", en: "60–75 min" },
    from: 2200,
    image: "cut-scissors-dark",
    alt: { sr: "Frizerka šiša ravnu tamnu kosu makazama", en: "Stylist cutting straight dark hair with scissors" },
    gallery: [
      { key: "look-copper-bob", alt: { sr: "Bakarni bob do brade", en: "Copper chin-length bob" } },
      { key: "cut-black-bob", alt: { sr: "Crni bob sa šiškama", en: "Black bob with a fringe" } },
      { key: "look-blonde-bob", alt: { sr: "Plavi bob iz profila", en: "Blonde bob in profile" } },
      { key: "cut-sectioning", alt: { sr: "Razdeljivanje kose pre šišanja", en: "Sectioning hair before the cut" } },
      { key: "cut-pixie", alt: { sr: "Kratka pixie frizura", en: "Short pixie cut" } },
      { key: "men-quiff", alt: { sr: "Muška frizura sa fade prelazom", en: "Men's cut with a fade" } },
    ],
    video: { src: "/video/cut.mp4", poster: "/video/cut.jpg" },
    priceCategories: ["sisanje"],
    steps: {
      sr: [
        { title: "Razgovor", text: "Deset minuta o tome kako živite sa svojom kosom." },
        { title: "Pranje", text: "Blagi šampon, maska po potrebi i masaža vlasišta." },
        { title: "Rez", text: "Na suvo ili mokro — prema strukturi kose." },
        { title: "Finiš", text: "Feniranje i kratka lekcija stylinga za kod kuće." },
      ],
      en: [
        { title: "Talk", text: "Ten minutes about how you live with your hair." },
        { title: "Wash", text: "Gentle shampoo, a mask if needed and a scalp massage." },
        { title: "Cut", text: "Dry or wet — whatever suits your hair texture." },
        { title: "Finish", text: "Blow-dry and a quick lesson in styling it at home." },
      ],
    },
    faq: {
      sr: [
        { q: "Koliko često treba da se šišam?", a: "Za bob i kratke frizure preporučujemo na 5–7 nedelja, za dužu kosu na 8–12 nedelja." },
        { q: "Da li šišate kovrdžavu kosu?", a: "Da. Jana i Mila šišaju kovrdže na suvo, pramen po pramen, bez stanjivanja." },
        { q: "Da li je feniranje uključeno u cenu?", a: "Jeste — svako žensko šišanje uključuje pranje i završno feniranje." },
      ],
      en: [
        { q: "How often should I get a haircut?", a: "Every 5–7 weeks for bobs and short cuts, every 8–12 weeks for longer hair." },
        { q: "Do you cut curly hair?", a: "Yes. Jana and Mila cut curls dry, curl by curl, without thinning shears." },
        { q: "Is the blow-dry included?", a: "It is — every women's cut includes a wash and a finishing blow-dry." },
      ],
    },
    stylists: ["jana", "luka", "mila"],
  },
  {
    id: "colour",
    slug: { sr: "farbanje-i-balayage", en: "colour-and-balayage" },
    num: "02",
    title: { sr: "Farbanje & balayage", en: "Colour & balayage" },
    short: { sr: "Balayage", en: "Balayage" },
    tagline: {
      sr: "Boja koja izgleda kao da ste leto proveli na moru — i raste lepo.",
      en: "Colour that looks like a summer by the sea — and grows out beautifully.",
    },
    intro: {
      sr: [
        "Balayage je slikanje, ne pramenovi. Mila i tim nanose posvetljivač slobodnom rukom, prateći kako vam kosa pada i gde bi je sunce prirodno posvetlilo. Rezultat je mekan prelaz bez oštre linije izrasta.",
        "Radimo sa profesionalnim italijanskim linijama boja bez amonijaka i sa bond zaštitom u svakom posvetljivanju. Pre prvog termina obavezno radimo test pramena i besplatnu konsultaciju.",
      ],
      en: [
        "Balayage is painting, not foils. Mila and the team apply lightener freehand, following how your hair falls and where the sun would naturally lighten it. The result is a soft blend with no harsh regrowth line.",
        "We work with professional ammonia-free Italian colour lines and add bond protection to every lightening service. Before a first appointment we always do a strand test and a free consultation.",
      ],
    },
    includes: {
      sr: ["Besplatna konsultacija i test pramena", "Bond zaštita pri svakom posvetljivanju", "Toner / gloss za željenu nijansu", "Tretman i feniranje", "Plan održavanja boje"],
      en: ["Free consultation and strand test", "Bond protection with every lightening", "Toner / gloss for your exact shade", "Treatment and blow-dry", "A colour maintenance plan"],
    },
    duration: { sr: "2–4 h", en: "2–4 hrs" },
    from: 4500,
    image: "colour-foils",
    alt: { sr: "Kosa u folijama tokom pramenovanja", en: "Hair wrapped in foils during a highlight" },
    gallery: [
      { key: "look-golden-waves", alt: { sr: "Zlatni balayage na talasastoj kosi", en: "Golden balayage on wavy hair" } },
      { key: "colour-honey-waves", alt: { sr: "Medeni balayage u talasima", en: "Honey balayage in waves" } },
      { key: "colour-ash-curls", alt: { sr: "Pepeljasti balayage na kovrdžama", en: "Ash balayage on curls" } },
      { key: "colour-painting", alt: { sr: "Nanošenje boje četkicom", en: "Painting colour on with a brush" } },
      { key: "colour-caramel-back", alt: { sr: "Karamel prelaz boje", en: "Caramel colour melt" } },
      { key: "colour-mushroom", alt: { sr: "Hladna mushroom plava", en: "Cool mushroom blonde" } },
    ],
    video: { src: "/video/colour.mp4", poster: "/video/colour.jpg" },
    priceCategories: ["farbanje", "balayage"],
    steps: {
      sr: [
        { title: "Konsultacija", text: "Gledamo fotografije, istoriju boje i test pramen." },
        { title: "Slikanje", text: "Balayage slobodnom rukom ili fine folije — po planu." },
        { title: "Toner", text: "Gloss koji određuje tačnu nijansu: med, pesak, karamel." },
        { title: "Nega", text: "Bond tretman, feniranje i plan za sledećih 12 nedelja." },
      ],
      en: [
        { title: "Consult", text: "We look at photos, your colour history and a strand test." },
        { title: "Paint", text: "Freehand balayage or fine foils — whatever the plan needs." },
        { title: "Tone", text: "A gloss that sets the exact shade: honey, sand, caramel." },
        { title: "Care", text: "Bond treatment, blow-dry and a plan for the next 12 weeks." },
      ],
    },
    faq: {
      sr: [
        { q: "Koliko traje balayage?", a: "Između 2,5 i 4 sata, u zavisnosti od dužine i gustine kose i početne boje." },
        { q: "Koliko često se osvežava?", a: "Balayage raste mekano — dovoljno je toniranje na 8 nedelja i novo slikanje na 3–4 meseca." },
        { q: "Da li mogu iz crne u plavu u jednom danu?", a: "Retko i ne preporučujemo. Veće promene radimo u dve do tri faze da kosa ostane zdrava." },
      ],
      en: [
        { q: "How long does balayage take?", a: "Between 2.5 and 4 hours, depending on length, density and your starting colour." },
        { q: "How often does it need a refresh?", a: "Balayage grows out softly — a toner every 8 weeks and new painting every 3–4 months is enough." },
        { q: "Can I go from black to blonde in one day?", a: "Rarely, and we don't recommend it. Big changes are done in two or three sessions to keep the hair healthy." },
      ],
    },
    stylists: ["mila", "jana"],
  },
  {
    id: "styling",
    slug: { sr: "feniranje-i-frizure", en: "blow-dry-and-styling" },
    num: "03",
    title: { sr: "Feniranje & frizure", en: "Blow-dry & styling" },
    short: { sr: "Feniranje", en: "Blow-dry" },
    tagline: {
      sr: "Volumen, sjaj i talasi koji traju do kasno u noć.",
      en: "Volume, shine and waves that last well past midnight.",
    },
    intro: {
      sr: [
        "Feniranje kod nas nije usputna usluga. Svaka kosa dobija termozaštitu, pravu veličinu četke i završni sjaj — bilo da je u pitanju glatko feniranje za posao ili holivudski talasi za veče.",
        "Za svečane frizure, mature i punđe radimo probu unapred, a na dan događaja stižete sa već opranom i osušenom kosom kako biste dobili više vremena za oblikovanje.",
      ],
      en: [
        "A blow-dry is never an afterthought here. Every head gets heat protection, the right brush size and a finishing gloss — whether it's a sleek workday blow-out or old-Hollywood waves for the evening.",
        "For occasion styles, proms and updos we do a trial in advance, and on the day you come in with freshly washed, dried hair so we have more time to shape.",
      ],
    },
    includes: {
      sr: ["Pranje i maska po izboru", "Termozaštita i proizvodi za volumen", "Feniranje, talasi ili peglanje", "Završni sjaj i fiksiranje"],
      en: ["Wash and a mask of your choice", "Heat protection and volume products", "Blow-dry, waves or straightening", "Finishing shine and hold"],
    },
    duration: { sr: "40–90 min", en: "40–90 min" },
    from: 1800,
    image: "style-blowdry-curls",
    alt: { sr: "Feniranje kovrdžave kose difuzerom", en: "Diffusing curly hair with a dryer" },
    gallery: [
      { key: "look-dark-curls", alt: { sr: "Tamni sjajni talasi", en: "Dark glossy waves" } },
      { key: "style-curling-iron", alt: { sr: "Uvijanje kose figarom", en: "Curling hair with a tong" } },
      { key: "style-finger-waves", alt: { sr: "Retro talasi sa ukrasom", en: "Retro finger waves with an accessory" } },
      { key: "style-auburn-waves", alt: { sr: "Kestenjasti talasi izbliza", en: "Auburn waves up close" } },
      { key: "style-copper-updo", alt: { sr: "Bakarna svečana punđa", en: "Copper occasion updo" } },
      { key: "style-curls-salon", alt: { sr: "Uvijanje u salonu", en: "Curling in the salon" } },
    ],
    video: { src: "/video/blowdry.mp4", poster: "/video/blowdry.jpg" },
    priceCategories: ["feniranje"],
    steps: {
      sr: [
        { title: "Pranje", text: "Šampon i maska prema tipu kose." },
        { title: "Priprema", text: "Termozaštita i proizvodi za volumen ili glatkoću." },
        { title: "Oblikovanje", text: "Četka, figaro ili pegla — kako želite." },
        { title: "Sjaj", text: "Završno ulje i lak koji ne lepi kosu." },
      ],
      en: [
        { title: "Wash", text: "Shampoo and a mask for your hair type." },
        { title: "Prep", text: "Heat protection plus volume or smoothing products." },
        { title: "Shape", text: "Round brush, tong or straightener — your call." },
        { title: "Shine", text: "Finishing oil and a flexible, non-sticky spray." },
      ],
    },
    faq: {
      sr: [
        { q: "Koliko traju talasi?", a: "Uz pravu pripremu 2–3 dana. Savetujemo da spavate sa svilenom maramom ili na svilenoj jastučnici." },
        { q: "Da li radite frizure za maturu?", a: "Da, sa probom nedelju dana ranije. Termine za maj i jun otvaramo već u februaru." },
        { q: "Mogu li doći bez pranja?", a: "Naravno — ako ste oprali kosu istog jutra, feniranje traje kraće i jeftinije je." },
      ],
      en: [
        { q: "How long do the waves last?", a: "With the right prep, 2–3 days. Sleep on a silk scarf or pillowcase to make them last." },
        { q: "Do you style for proms?", a: "Yes, with a trial a week before. May and June slots open as early as February." },
        { q: "Can I come in without a wash?", a: "Of course — if you washed your hair that morning, the blow-dry is quicker and cheaper." },
      ],
    },
    stylists: ["jana", "mila"],
  },
  {
    id: "treatments",
    slug: { sr: "keratin-i-tretmani", en: "keratin-and-treatments" },
    num: "04",
    title: { sr: "Keratin & tretmani", en: "Keratin & treatments" },
    short: { sr: "Tretmani", en: "Treatments" },
    tagline: {
      sr: "Kosa kao svila, bez frizova — čak i u avgustu na Dunavu.",
      en: "Silk-smooth, frizz-free hair — even in August by the Danube.",
    },
    intro: {
      sr: [
        "Keratinsko ispravljanje radimo formulama bez formaldehida koje ne menjaju prirodni talas, već ga smiruju. Kosa se brže suši, lakše se fenira i ostaje glatka tri do pet meseci.",
        "Za oštećenu i posvetljenu kosu imamo tretmane koji obnavljaju veze u vlaknu, dubinsku hidrataciju i tretmane vlasišta sa pilingom i masažom — idealno kao pauza od 45 minuta u toku nedelje.",
      ],
      en: [
        "Keratin smoothing is done with formaldehyde-free formulas that calm your natural wave rather than erase it. Hair dries faster, blow-dries easier and stays smooth for three to five months.",
        "For damaged and lightened hair we offer bond-rebuilding treatments, deep hydration and scalp rituals with exfoliation and massage — a perfect 45-minute pause in the middle of the week.",
      ],
    },
    includes: {
      sr: ["Analiza kose i vlasišta", "Formula bez formaldehida", "Pranje, nanošenje i peglanje", "Uputstvo za negu i šampon bez sulfata"],
      en: ["Hair and scalp analysis", "Formaldehyde-free formula", "Wash, application and sealing", "Aftercare guide and a sulphate-free shampoo"],
    },
    duration: { sr: "45 min – 3 h", en: "45 min – 3 hrs" },
    from: 2600,
    image: "treat-basin",
    alt: { sr: "Pranje kose u salonu na lavabou", en: "Hair wash at the salon basin" },
    gallery: [
      { key: "look-bronze-portrait", alt: { sr: "Sjajna, zdrava duga kosa", en: "Glossy, healthy long hair" } },
      { key: "treat-wash", alt: { sr: "Masaža vlasišta tokom pranja", en: "Scalp massage during the wash" } },
      { key: "treat-gloss", alt: { sr: "Sjajna kestenjasta kosa pozadi", en: "Glossy chestnut hair from behind" } },
      { key: "product-shampoo", alt: { sr: "Bočica profesionalnog šampona", en: "A bottle of professional shampoo" } },
      { key: "treat-silk-texture", alt: { sr: "Tekstura glatke kose", en: "Silky hair texture" } },
      { key: "product-bronze", alt: { sr: "Bronzane bočice preparata za negu", en: "Bronze bottles of care products" } },
    ],
    video: { src: "/video/curl.mp4", poster: "/video/curl.jpg" },
    priceCategories: ["tretmani"],
    steps: {
      sr: [
        { title: "Analiza", text: "Gledamo vlakno, poroznost i stanje vlasišta." },
        { title: "Čišćenje", text: "Dubinski šampon koji otvara kutikulu." },
        { title: "Tretman", text: "Keratin, bond ili hidratacija — pramen po pramen." },
        { title: "Zatvaranje", text: "Feniranje i peglanje koje zaključava rezultat." },
      ],
      en: [
        { title: "Analyse", text: "We check the fibre, porosity and your scalp." },
        { title: "Cleanse", text: "A clarifying shampoo that opens the cuticle." },
        { title: "Treat", text: "Keratin, bond or hydration — section by section." },
        { title: "Seal", text: "Blow-dry and flat iron to lock the result in." },
      ],
    },
    faq: {
      sr: [
        { q: "Da li keratin sadrži formaldehid?", a: "Ne. Koristimo isključivo formule bez formaldehida i njegovih derivata." },
        { q: "Kada mogu da operem kosu posle keratina?", a: "Već sledećeg dana. Savetujemo šampon bez sulfata da efekat traje duže." },
        { q: "Mogu li da farbam kosu posle keratina?", a: "Da, ali je najbolje da farbanje uradite pre keratina ili dve nedelje posle." },
      ],
      en: [
        { q: "Does your keratin contain formaldehyde?", a: "No. We only use formulas free of formaldehyde and its derivatives." },
        { q: "When can I wash my hair after keratin?", a: "The very next day. A sulphate-free shampoo makes the result last longer." },
        { q: "Can I colour my hair after keratin?", a: "Yes, but ideally colour before the keratin or two weeks after it." },
      ],
    },
    stylists: ["mila", "jana"],
  },
  {
    id: "nails",
    slug: { sr: "nokti", en: "nails" },
    num: "05",
    title: { sr: "Nokti", en: "Nails" },
    short: { sr: "Nokti", en: "Nails" },
    tagline: {
      sr: "Čist, minimalan manikir koji traje tri nedelje bez ljuštenja.",
      en: "Clean, minimal manicures that last three weeks without chipping.",
    },
    intro: {
      sr: [
        "Tea radi ruski (suvi) manikir aparatom, što znači da je zanoktica uredna nedeljama, a lak ide tik uz kožicu. Nijanse biramo iz palete od preko 200 tonova — od golih nude do duboke boje vina.",
        "Svi instrumenti se sterilišu u autoklavu i pakuju pojedinačno. Kese otvaramo pred vama.",
      ],
      en: [
        "Tea does Russian (dry, e-file) manicures, which means your cuticles stay neat for weeks and polish sits right up to the skin. Choose from 200+ shades — from bare nudes to a deep wine.",
        "All instruments are sterilised in an autoclave and individually packed. We open the pouch in front of you.",
      ],
    },
    includes: {
      sr: ["Sterilni instrumenti iz autoklava", "Ruski manikir aparatom", "Oblikovanje i nega kožice", "Trajni lak ili gel po izboru", "Ulje za zanoktice na kraju"],
      en: ["Autoclave-sterilised instruments", "Russian e-file manicure", "Shaping and cuticle care", "Gel polish or builder gel", "Cuticle oil to finish"],
    },
    duration: { sr: "45–120 min", en: "45–120 min" },
    from: 1800,
    image: "nails-nude-fur",
    alt: { sr: "Ruke sa nude manikirom na krznu", en: "Hands with a nude manicure on faux fur" },
    gallery: [
      { key: "nails-nude-hand", alt: { sr: "Nude bademasti nokti", en: "Nude almond nails" } },
      { key: "nails-pastel", alt: { sr: "Pastelni trajni lak", en: "Pastel gel polish" } },
      { key: "nails-manicure", alt: { sr: "Manikir u toku", en: "Manicure in progress" } },
      { key: "nails-soft", alt: { sr: "Meki nude manikir", en: "Soft nude manicure" } },
      { key: "nails-wall", alt: { sr: "Zid sa lakovima", en: "A wall of polish shades" } },
      { key: "nails-nude-pair", alt: { sr: "Dve ruke sa nude noktima", en: "Two hands with nude nails" } },
    ],
    priceCategories: ["nokti"],
    steps: {
      sr: [
        { title: "Oblik", text: "Badem, oval ili kvadrat — prema vašim prstima." },
        { title: "Kožica", text: "Suvi ruski manikir aparatom, bez sečenja kože." },
        { title: "Boja", text: "Paleta od 200+ nijansi i baza koja ojačava." },
        { title: "Nega", text: "Ulje za zanoktice i savet za trajnost." },
      ],
      en: [
        { title: "Shape", text: "Almond, oval or square — to suit your fingers." },
        { title: "Cuticle", text: "Dry Russian e-file manicure, no cutting of skin." },
        { title: "Colour", text: "200+ shades and a strengthening base." },
        { title: "Care", text: "Cuticle oil and tips for making it last." },
      ],
    },
    faq: {
      sr: [
        { q: "Koliko traje trajni lak?", a: "Tri do četiri nedelje. Ako se odlomi u prvih 7 dana, popravka je besplatna." },
        { q: "Da li skidate gel iz drugog salona?", a: "Da, skidanje traje 15 minuta i naplaćuje se 900 RSD." },
        { q: "Radite li nail art?", a: "Radimo minimalni nail art: tanke linije, francuski, hrom i sitne detalje." },
      ],
      en: [
        { q: "How long does gel polish last?", a: "Three to four weeks. If it chips within 7 days, the fix is free." },
        { q: "Do you remove gel from another salon?", a: "Yes, removal takes 15 minutes and costs 900 RSD." },
        { q: "Do you do nail art?", a: "Minimal nail art: fine lines, French tips, chrome and small details." },
      ],
    },
    stylists: ["tea"],
  },
  {
    id: "brows",
    slug: { sr: "obrve-i-trepavice", en: "brows-and-lashes" },
    num: "06",
    title: { sr: "Obrve & trepavice", en: "Brows & lashes" },
    short: { sr: "Obrve", en: "Brows" },
    tagline: {
      sr: "Okvir lica koji izgleda prirodno — samo bolje.",
      en: "A frame for your face that looks natural — just better.",
    },
    intro: {
      sr: [
        "Sara oblikuje obrve prema proporcijama lica, a ne prema trendu. Laminacija daje efekat češljanih, gustih obrva koji traje šest nedelja, a henna popunjava praznine bez efekta tetovaže.",
        "Lash lift podiže vaše prirodne trepavice od korena, bez ekstenzija. Za one koje žele više, radimo klasične 1:1 i volume trepavice od lagane svile.",
      ],
      en: [
        "Sara shapes brows to your facial proportions, not to a trend. Lamination gives a brushed-up, fuller brow that lasts six weeks, while henna fills gaps without looking tattooed.",
        "A lash lift curls your natural lashes from the root, no extensions needed. For more drama we do classic 1:1 and volume sets in lightweight silk.",
      ],
    },
    includes: {
      sr: ["Mapiranje obrva prema licu", "Hipoalergeni preparati", "Farbanje u nijansi kose", "Nega i uputstvo za prvih 48 h"],
      en: ["Brow mapping to your face", "Hypoallergenic products", "Tint matched to your hair", "Aftercare for the first 48 hours"],
    },
    duration: { sr: "20–120 min", en: "20–120 min" },
    from: 900,
    image: "brows-arch",
    alt: { sr: "Oblikovana obrva izbliza", en: "A shaped brow up close" },
    gallery: [
      { key: "brows-portrait", alt: { sr: "Portret sa oblikovanim obrvama", en: "Portrait with shaped brows" } },
      { key: "lashes-volume", alt: { sr: "Volume trepavice izbliza", en: "Volume lashes up close" } },
      { key: "brows-tint", alt: { sr: "Farbanje obrva četkicom", en: "Tinting brows with a brush" } },
      { key: "brows-warm", alt: { sr: "Tople tonirane obrve", en: "Warm tinted brows" } },
      { key: "lashes-application", alt: { sr: "Postavljanje trepavica", en: "Applying lash extensions" } },
    ],
    priceCategories: ["obrve"],
    steps: {
      sr: [
        { title: "Mapiranje", text: "Merimo proporcije i biramo oblik zajedno." },
        { title: "Oblikovanje", text: "Vosak, pinceta ili konac — nežno." },
        { title: "Boja", text: "Farba ili henna u nijansi vaše kose." },
        { title: "Finiš", text: "Gel, serum i uputstvo za negu." },
      ],
      en: [
        { title: "Map", text: "We measure proportions and choose the shape together." },
        { title: "Shape", text: "Wax, tweezers or thread — gently." },
        { title: "Tint", text: "Tint or henna matched to your hair." },
        { title: "Finish", text: "Gel, serum and aftercare instructions." },
      ],
    },
    faq: {
      sr: [
        { q: "Koliko traje laminacija obrva?", a: "Pet do šest nedelja. Prva 24 sata obrve ne treba kvasiti." },
        { q: "Da li lash lift oštećuje trepavice?", a: "Ne, ako se radi na 6–8 nedelja i uz serum za negu koji dobijate kod nas." },
        { q: "Radite li patch test?", a: "Da, za farbanje i henna tretmane radimo test 48 sati ranije, besplatno." },
      ],
      en: [
        { q: "How long does brow lamination last?", a: "Five to six weeks. Keep brows dry for the first 24 hours." },
        { q: "Does a lash lift damage lashes?", a: "No, if done every 6–8 weeks with the conditioning serum we give you." },
        { q: "Do you do a patch test?", a: "Yes, for tints and henna we do a free test 48 hours in advance." },
      ],
    },
    stylists: ["sara"],
  },
  {
    id: "bridal",
    slug: { sr: "vencanja", en: "bridal" },
    num: "07",
    title: { sr: "Venčanja", en: "Bridal" },
    short: { sr: "Venčanja", en: "Bridal" },
    tagline: {
      sr: "Mirno jutro pred venčanje, frizura koja preživi i poslednji ples.",
      en: "A calm wedding morning, and hair that survives the last dance.",
    },
    intro: {
      sr: [
        "Za mlade radimo probnu frizuru mesec dana ranije, kada zajedno biramo oblik, ukras i veo. Na dan venčanja dolazimo kod vas ili vas čekamo u salonu od 7 ujutru, sa kafom i mirom.",
        "Paketi uključuju frizuru za mladu i deveruše, manikir dan ranije i oblikovanje obrva nedelju dana pre — kako bi sve leglo na svoje mesto.",
      ],
      en: [
        "Brides get a hair trial a month before, when we choose the shape, accessories and veil placement together. On the day we come to you, or open the salon for you from 7 am, with coffee and calm.",
        "Packages include hair for the bride and bridesmaids, a manicure the day before and a brow shape a week ahead — so everything settles into place.",
      ],
    },
    includes: {
      sr: ["Probna frizura mesec dana ranije", "Frizura na dan venčanja i fiksiranje vela", "Manikir dan pre venčanja", "Oblikovanje obrva nedelju dana ranije", "Mini set za popravke tokom večeri"],
      en: ["Hair trial a month before", "Wedding-day styling and veil placement", "Manicure the day before", "Brow shaping a week ahead", "A touch-up kit for the evening"],
    },
    duration: { sr: "Probna 90 min · dan venčanja 2 h", en: "Trial 90 min · wedding day 2 hrs" },
    from: 9000,
    image: "bridal-veil",
    alt: { sr: "Mlada sa punđom i velom", en: "Bride with an updo and a veil" },
    gallery: [
      { key: "look-bridal-pearls", alt: { sr: "Venčana punđa sa biserima", en: "Bridal updo with pearls" } },
      { key: "bridal-chignon", alt: { sr: "Plava niska punđa sa ukrasom", en: "Blonde low chignon with an ornament" } },
      { key: "bridal-half-up", alt: { sr: "Poluskupljena kosa sa cvetnim ukrasom", en: "Half-up style with floral pins" } },
      { key: "bridal-low-bun", alt: { sr: "Tamna niska punđa", en: "Dark low bun" } },
      { key: "style-finger-waves", alt: { sr: "Retro talasi za venčanje", en: "Retro waves for a wedding" } },
    ],
    priceCategories: [],
    steps: {
      sr: [
        { title: "Upoznavanje", text: "Besplatna konsultacija 3–6 meseci pred venčanje." },
        { title: "Proba", text: "Probna frizura mesec dana ranije, sa velom i ukrasima." },
        { title: "Priprema", text: "Obrve nedelju dana ranije, manikir dan pre." },
        { title: "Veliki dan", text: "Od 7 ujutru, u salonu ili kod vas." },
      ],
      en: [
        { title: "Meet", text: "A free consultation 3–6 months before the wedding." },
        { title: "Trial", text: "A hair trial a month before, with veil and accessories." },
        { title: "Prep", text: "Brows a week before, manicure the day before." },
        { title: "The day", text: "From 7 am, at the salon or wherever you are." },
      ],
    },
    faq: {
      sr: [
        { q: "Koliko ranije treba da rezervišem?", a: "Za subote od maja do oktobra preporučujemo 4–6 meseci unapred." },
        { q: "Da li dolazite na adresu?", a: "Da, u Beogradu i okolini. Izlazak na adresu naplaćuje se 4.000 RSD." },
        { q: "Da li radite šminku?", a: "Ne radimo šminku, ali sarađujemo sa proverenim make-up artistima i rado vas povezujemo." },
      ],
      en: [
        { q: "How far ahead should I book?", a: "For Saturdays from May to October we recommend 4–6 months ahead." },
        { q: "Do you come to the venue?", a: "Yes, in Belgrade and nearby. On-location styling adds 4,000 RSD." },
        { q: "Do you do make-up?", a: "We don't, but we work with trusted make-up artists and are happy to introduce you." },
      ],
    },
    stylists: ["mila", "jana", "tea", "sara"],
  },
];

export const bridalPackages: { id: string; name: Localized<string>; price: number; items: Localized<string[]> }[] = [
  {
    id: "bride",
    name: { sr: "Mlada", en: "The bride" },
    price: 14500,
    items: {
      sr: ["Probna frizura", "Venčana frizura i veo", "Manikir trajnim lakom"],
      en: ["Hair trial", "Wedding hair and veil", "Gel manicure"],
    },
  },
  {
    id: "bride-plus",
    name: { sr: "Mlada + 2 deveruše", en: "Bride + 2 bridesmaids" },
    price: 26000,
    items: {
      sr: ["Sve iz paketa Mlada", "Dve frizure za deveruše", "Laminacija obrva za mladu"],
      en: ["Everything in The bride", "Two bridesmaid styles", "Brow lamination for the bride"],
    },
  },
  {
    id: "ondine",
    name: { sr: "Ondine dan", en: "The Ondine day" },
    price: 42000,
    items: {
      sr: ["Salon samo za vas od 7 ujutru", "Mlada + do 4 frizure", "Manikir za sve", "Šampanjac i doručak"],
      en: ["The salon to yourselves from 7 am", "Bride + up to 4 styles", "Manicures for everyone", "Champagne and breakfast"],
    },
  },
];

export const serviceById = (id: string) => services.find((s) => s.id === id)!;
