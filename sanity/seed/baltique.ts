/**
 * Baltique launch content, verbatim from the Canva mockup (docs/10-baltique-briefing-spec.md).
 * Two uses:
 *  1. Demo mode: rendered directly when Sanity isn't configured (src/modules/content/demo.ts).
 *  2. `pnpm seed:ndjson` turns it into sanity/seed/baltique.ndjson for `sanity dataset import`.
 * Placeholders from the mockup are kept explicit in [brackets] so nothing fake ships silently.
 */

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = { _type: "block"; _key: string; style: string; markDefs: never[]; children: Span[] };

let n = 0;
const key = () => `k${(++n).toString(36)}`;

/** Portable Text paragraph; `**bold**` segments become strong. */
function p(text: string, style = "normal"): Block {
  const children: Span[] = [];
  text.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (!part) return;
    const bold = part.startsWith("**");
    children.push({ _type: "span", _key: key(), text: bold ? part.slice(2, -2) : part, marks: bold ? ["strong"] : [] });
  });
  return { _type: "block", _key: key(), style, markDefs: [], children };
}

/** Image assets. In demo mode `url` is served from /public; the NDJSON export uploads the file. */
export const demoImages = {
  logo: {
    file: "logo-stamp.png",
    url: "/images/logo-stamp.png",
    w: 700,
    h: 700,
    alt: "Baltique stamp logo: discover the undiscovered",
  },
  heroLake: {
    file: "hero-aerial-lake.jpg",
    url: "/images/brief/hero-aerial-lake.jpg",
    w: 1800,
    h: 1126,
    alt: "Aerial view of a misty Latvian lake surrounded by forest",
  },
  folkBoots: {
    file: "folk-boots.jpg",
    url: "/images/brief/folk-boots.jpg",
    w: 615,
    h: 403,
    alt: "Traditional Latvian folk costume and woven boots",
  },
  forestWoman: {
    file: "forest-woman.jpg",
    url: "/images/brief/forest-woman.jpg",
    w: 984,
    h: 1229,
    alt: "A woman holding foraged mushrooms in a Latvian forest",
  },
  redDeer: {
    file: "red-deer.jpg",
    url: "/images/brief/red-deer.jpg",
    w: 1000,
    h: 500,
    alt: "A red deer stag standing at the edge of an autumn forest",
  },
  sunset: {
    file: "sunset-sky.jpg",
    url: "/images/brief/sunset-sky.jpg",
    w: 1264,
    h: 1685,
    alt: "Warm sunset light over water",
  },
  winterAerial: {
    file: "winter-aerial.jpg",
    url: "/images/brief/winter-aerial.jpg",
    w: 1800,
    h: 1200,
    alt: "Aerial view of a snow-covered Latvian village in winter",
  },
  frostForest: {
    file: "frost-forest.jpg",
    url: "/images/brief/frost-forest.jpg",
    w: 400,
    h: 267,
    alt: "Frost-covered forest boardwalk",
  },
  riverAutumn: {
    file: "river-autumn.jpg",
    url: "/images/brief/river-autumn.jpg",
    w: 410,
    h: 272,
    alt: "A river winding through Latvian forest in autumn",
  },
  rigaSkyline: {
    file: "riga-skyline.jpg",
    url: "/images/brief/riga-skyline.jpg",
    w: 410,
    h: 274,
    alt: "Rīga skyline with Art Nouveau rooftops",
  },
  winterTree: {
    file: "winter-tree.jpg",
    url: "/images/brief/winter-tree.jpg",
    w: 410,
    h: 274,
    alt: "Lone birch tree in snow at sunrise",
  },
  jeepRoad: {
    file: "jeep-road.jpg",
    url: "/images/brief/jeep-road.jpg",
    w: 1800,
    h: 1200,
    alt: "A red 4x4 with a roof tent on a Latvian road",
  },
  jeepView: {
    file: "jeep-view.jpg",
    url: "/images/brief/jeep-view.jpg",
    w: 1800,
    h: 1200,
    alt: "View from a 4x4 over Latvian countryside",
  },
  snowForest: {
    file: "snow-forest.jpg",
    url: "/images/brief/snow-forest.jpg",
    w: 1000,
    h: 668,
    alt: "Snow-covered pine forest",
  },
} as const;

export type DemoImageKey = keyof typeof demoImages;
export const demoAssetId = (k: DemoImageKey) => `image-demo-${k}`;

const img = (k: DemoImageKey, alt?: string) => ({
  _type: "accessibleImage",
  _key: key(),
  asset: { _type: "reference", _ref: demoAssetId(k) },
  alt: alt ?? demoImages[k].alt,
});

const internal = (label: string, type: string, id: string) => ({
  _type: "link",
  _key: key(),
  label,
  kind: "internal",
  internal: { _type: "reference", _ref: id, _weak: true, _strengthenOnPublish: { type } },
});

const enquiryForm = () => ({
  _type: "enquiryFormBlock",
  _key: key(),
  heading: "Plan your journey",
  intro: [
    p("Complete the form and I will contact you with a personalised, no-obligation quote."),
    p(
      "Tell me a little about the trip you have in mind: who's travelling, when, and what makes you curious. Nothing needs to be decided yet. You'll hear back from me within a week. Depending on the kind of journey, we'll then schedule a first phone call or an in-person meeting to shape your trip together.",
    ),
  ],
  script: "let's create experiences that stay",
  tripTypes: [
    "Nature & hiking",
    "Adventure (4x4, kayaking)",
    "Sauna & wellness",
    "Culinary & culture",
    "Hunting trip",
    "A bit of everything",
  ],
  submitLabel: "Send",
  note: "Your details are only used to answer your enquiry.",
  successMessage: "Thank you. You will hear back within a week.",
});

// Reviews are lorem ipsum in the mockup (SPEC §6.3). Left out until real, attributed quotes exist.

const guides = [
  { id: "guide-winter-vidzeme", title: "[Itinerary 1 — e.g. Winter in Vidzeme]", image: "frostForest" },
  { id: "guide-gauja-kayak", title: "[Itinerary 2 — e.g. Gauja by kayak]", image: "riverAutumn" },
  { id: "guide-riga-coast", title: "[Itinerary 3 — e.g. Rīga & the coast]", image: "rigaSkyline" },
  { id: "guide-sauna-silence", title: "[Itinerary 4 — e.g. Sauna & silence]", image: "winterTree" },
  { id: "guide-five", title: "[Guide 5 title]", image: "winterAerial" },
] as const;

export const demoDocuments: Record<string, unknown>[] = [
  ...Object.entries(demoImages).map(([k, v]) => ({
    _id: demoAssetId(k as DemoImageKey),
    _type: "sanity.imageAsset",
    url: v.url,
    metadata: { dimensions: { width: v.w, height: v.h, aspectRatio: v.w / v.h } },
  })),
  {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Baltique",
    tagline: "Bespoke boutique journeys in the Baltics",
    scriptTagline: "discover the undiscovered",
    founderName: "Fabienne Verschelde",
    logo: img("logo"),
    mainMenu: [
      internal("Home", "homePage", "homePage"),
      internal("Services", "page", "page-services"),
      internal("Itineraries", "guidesPage", "guidesPage"),
      internal("About", "page", "page-about"),
      internal("Contact", "page", "page-contact"),
    ],
    footerHeadline: "Bespoke boutique journeys in the Baltics",
    footerImage: img("snowForest", ""),
    legalLinks: [],
    email: "info@balt-run.com",
    // Verify before launch: one digit too many for a Belgian mobile (SPEC §6.7).
    phone: "+32 4981 12 36 30",
    whatsapp: "324981123630",
    social: [],
    company: { legalName: "Baltique · Fabienne Verschelde" },
    defaultSeo: {
      title: "Baltique — Bespoke boutique journeys in the Baltics",
      description:
        "Tailor-made journeys through Latvia: forest hikes, 4x4 adventures, kayaking, sauna rituals, manor-house stays and authentic small-group hunting trips. Every journey built from scratch, around you.",
      image: img("heroLake"),
    },
  },
  { _id: "announcement", _type: "announcement", enabled: false },
  {
    _id: "homePage",
    _type: "homePage",
    title: "Home",
    sections: [
      {
        _type: "heroBlock",
        _key: key(),
        variant: "brand",
        headline: "Baltique",
        script: "discover the undiscovered",
        tag: "Bespoke boutique journeys in the Baltics",
        image: img("heroLake"),
      },
      {
        _type: "featureBlock",
        _key: key(),
        heading: "Four seasons. Endless forests.",
        title: "Tailor-made journeys through Latvia",
        body: [
          p(
            "From forest hikes and 4x4 off-road adventures to kayaking in national parks, traditional Latvian sauna rituals and nights in centuries-old manor houses: every Baltique journey is built from scratch, around you. Latvia shows all four seasons at their finest, so every visit feels like a different country.",
          ),
        ],
        image: img("forestWoman"),
        imagePosition: "right",
        imageShape: "tall",
        action: internal("Learn more", "page", "page-services"),
      },
      {
        _type: "featureBlock",
        _key: key(),
        title: "Authentic hunting trips in Latvia",
        body: [
          p(
            "An intimate, small-group hunting experience in the forests of Vidzeme. No tracking, no rush, no staged hunt. You live by the river, sleep in the forest and move to the rhythm of the animals, the way hunting was always meant to be.",
          ),
        ],
        image: img("redDeer"),
        imagePosition: "left",
        imageShape: "wide",
        action: internal("Learn more", "page", "page-services"),
      },
      {
        _type: "featureBlock",
        _key: key(),
        heading: "A country waiting to be discovered.",
        body: [
          p(
            "Latvia is one of Europe's best-kept secrets, and for years I've watched friends and family fall in love with it. Baltique was born from that: a way to share this country with travellers who want more than a standard holiday. I know the places, the people and the paths off the map. You bring the curiosity; I'll take care of the rest.",
          ),
        ],
        image: img("winterAerial"),
        imagePosition: "right",
        imageShape: "wide",
        action: internal("Learn more", "page", "page-about"),
      },
      enquiryForm(),
      { _type: "guideListBlock", _key: key(), heading: "Itineraries", variant: "carousel", mode: "latest", limit: 6 },
    ],
    seo: { title: "Baltique — Bespoke boutique journeys in the Baltics" },
  },
  {
    _id: "page-services",
    _type: "page",
    title: "What we offer",
    slug: { _type: "slug", current: "services" },
    sections: [
      { _type: "pageHeroBlock", _key: key(), variant: "text", title: "What we offer", script: "only in Latvia" },
      {
        _type: "featureBlock",
        _key: key(),
        title: "Bespoke journeys to Latvia",
        label: "Journeys shaped around you",
        body: [
          p(
            "No two Baltique journeys are the same, because no two travellers are. Whether you're after quiet nature, adventure, great food or a bit of everything, **I design your trip entirely around your wishes, your pace and your travel companions.**",
          ),
          p(
            "**Latvia offers far more than most people expect.** More than half of the country is covered in forest, dotted with rivers, lakes, bogs and a long, empty Baltic coastline. Think guided hikes and bog walks, 4x4 off-road adventures, kayaking and canoeing through national parks like Gauja, culinary experiences with local producers, and the traditional Latvian pirts: a sauna ritual with birch whisks, herbs and a plunge in cold water. Add medieval castles, forgotten manor houses and the Art Nouveau streets of Riga, and you have a country that rewards curiosity.",
          ),
          p(
            "And then there are the seasons. **Latvia knows all four at their best:** warm, long summer days with nature in full bloom, a golden and fiery autumn, a white, snow-covered winter and a spring in which the forest wakes up again. The same place can feel completely new three months later.",
          ),
          p(
            "**What you get with Baltique: a personal itinerary, carefully selected stays, local guides and hosts I know and trust, and a single point of contact from first idea to journey home.** You enjoy the trip; I handle the planning.",
          ),
        ],
        image: img("riverAutumn"),
        imagePosition: "left",
        imageShape: "wide",
        action: internal("Plan your journey", "page", "page-contact"),
      },
      {
        _type: "featureBlock",
        _key: key(),
        title: "Hunting trips in Latvia",
        label: "Hunt the way it used to be",
        body: [
          p(
            "Forests are at the heart of Latvia: they cover more than half of the country, and forestry is one of its most important industries. **Hunting is deeply rooted in Latvian culture and remarkably well organised, with hunting teams working together across the entire country.**",
          ),
          p(
            "Our hunting trips take place in Amata, in the Vidzeme region, about 1.5 hours from Riga. **They are organised and guided by Toms and Kristers, local hunters who know these forests like no one else.** This is hunting as our ancestors knew it: living with and out of respect for nature. You sleep in hammocks, or in a heated tent in winter, you live by the river and in the forest, and whatever is taken ends up on your plate that same day. Above all, you follow the rhythm of the animals: you go out when they do, not the other way around.",
          ),
          p(
            "There is no tracking. Instead, the guides use traditional and inventive methods, such as calls and scents, to bring the animals to you. **The forest is home to roe deer, red deer, moose, wild boar, wolves, lynx, foxes and brown bears (bears are protected and are never hunted).** Honestly: this is not for the faint-hearted. The team uses professional equipment, but the forest is vast and rough. It can happen that you drag your animal out of the forest yourself, as a team, and help butcher it straight away at base camp. **Good physical condition and a no-nonsense, can-do mindset are essential.**",
          ),
        ],
        image: img("redDeer"),
        imagePosition: "right",
        imageShape: "wide",
        action: internal("Ask about a hunting trip", "page", "page-contact"),
      },
      enquiryForm(),
    ],
    seo: {
      title: "What we offer — Baltique",
      description:
        "Bespoke journeys to Latvia and authentic small-group hunting trips in Vidzeme, designed entirely around you.",
    },
  },
  {
    _id: "guidesPage",
    _type: "guidesPage",
    title: "Our curated guides",
    sections: [
      {
        _type: "pageHeroBlock",
        _key: key(),
        variant: "text",
        title: "Our curated guides",
        script: "beyond bucket lists",
      },
      {
        _type: "richTextBlock",
        _key: key(),
        variant: "columns",
        body: [
          p(
            "You won't find ready-made packages here. Every Baltique journey is designed personally, and that conversation is one we'll have together. What you will find are the stories, experiences and places that make Latvia so special: new hotspots, favourite day trips, local tips and what to do where, in every season.",
          ),
          p(
            "**Still wondering whether Latvia is for you? Let these guides convince you.** Already planning a day or two on your own? Use them as inspiration and a starting point. Either way, consider this a glimpse into the country I've come to know so well, one story at a time.",
          ),
        ],
      },
      {
        _type: "guideListBlock",
        _key: key(),
        variant: "grid",
        mode: "latest",
        limit: 5,
        ctaText: "Can't find what you're dreaming of? Get in touch anyway.",
        ctaLink: internal("Get in touch", "page", "page-contact"),
        ctaImage: img("jeepView", ""),
      },
    ],
    seo: {
      title: "Curated guides — Baltique",
      description:
        "Stories, day trips and local tips for Latvia in every season: inspiration for your own bespoke Baltique journey.",
    },
  },
  {
    _id: "page-about",
    _type: "page",
    title: "Why I started",
    slug: { _type: "slug", current: "about" },
    sections: [
      {
        _type: "featureBlock",
        _key: key(),
        heading: "Why I started",
        body: [
          p("Hi, I'm Fabienne Verschelde, the person behind Baltique."),
          p(
            "I studied law practice and business sciences, but my real education in travel started in Latvia. During my student years, I started a side business renting out my parents' holiday villas in Amatciems, a private village in the forests of Vidzeme. Every year I brought friends along, and every year the same thing happened: they were amazed. **A country so unknown, with so much to offer. And every single one of them wanted to come back.**",
          ),
          p(
            "Soon, I was planning trips for family and friends as well. The reactions were overwhelmingly positive, and they immediately started recommending the experience to people they knew.",
          ),
          p(
            "Around the same time, I organised a first hunting trip for my husband with Toms and Kristers. It was a bullseye. The stories spread, and before long, a fellow hunter wanted to join too.",
          ),
          p(
            "There are so many people curious about the Baltics who simply don't know where to start. People with busy lives who prefer to hand over their holiday planning to someone they trust. Hunters who wish their family could come along. Travellers looking for something genuinely new.",
          ),
          p(
            "**So Baltique was born: a boutique travel agency for anyone who wants to discover the undiscovered, with someone who knows the way.**",
          ),
          p(
            "For now, I focus on Latvia, the country I know best. But I'm steadily building my network in neighbouring Lithuania and Estonia, so that soon I can offer you the best places and experiences across all three Baltic states.",
          ),
        ],
        image: img("jeepRoad"),
        imagePosition: "right",
        imageShape: "tall",
        action: internal("Get in touch", "page", "page-contact"),
      },
      // Mockup shows three empty polaroid frames (SPEC §6.4); mockup photos stand in until personal ones arrive.
      {
        _type: "polaroidsBlock",
        _key: key(),
        images: [
          img("forestWoman", "[Personal photo 1]"),
          img("winterAerial", "[Personal photo 2]"),
          img("sunset", "[Personal photo 3]"),
        ],
      },
    ],
    seo: {
      title: "Why I started — Baltique",
      description:
        "Fabienne Verschelde on how Baltique began: from renting family villas in Amatciems to a boutique travel agency for the Baltics.",
    },
  },
  {
    _id: "page-contact",
    _type: "page",
    title: "Contact us",
    slug: { _type: "slug", current: "contact" },
    sections: [
      {
        _type: "pageHeroBlock",
        _key: key(),
        variant: "card",
        title: "Contact us",
        script: "we'll get back to you",
        image: img("jeepView", ""),
        cardBody: [
          p(
            "Every great trip starts with a conversation. Maybe you already know exactly what you want: a week of hiking and sauna rituals, a hunting trip with your family, a winter escape in the snow. Or maybe you just have a feeling that Latvia is worth a look. Both are a perfect place to start. I read every message personally and will get back to you within a week.",
          ),
          p(
            "Looking for something you don't see on this website? Ask anyway. If it can be done in the Baltics, chances are we can make it happen.",
          ),
        ],
        action: { _type: "link", _key: key(), label: "Plan your journey", kind: "external", external: "#plan" },
      },
      enquiryForm(),
    ],
    seo: {
      title: "Contact — Baltique",
      description: "Get in touch with Fabienne Verschelde to start planning a bespoke journey to Latvia.",
    },
  },
  {
    _id: "category-itineraries",
    _type: "category",
    title: "Itineraries",
    slug: { _type: "slug", current: "itineraries" },
  },
  { _id: "author-fabienne", _type: "author", name: "Fabienne Verschelde" },
  ...guides.map((g, i) => ({
    _id: g.id,
    _type: "guide",
    title: g.title,
    slug: { _type: "slug", current: g.id.replace("guide-", "") },
    category: { _type: "reference", _ref: "category-itineraries" },
    author: { _type: "reference", _ref: "author-fabienne" },
    publishedAt: new Date(Date.UTC(2026, 8, 21 - i)).toISOString(),
    excerpt: "[Two-line teaser: season, length, highlights.]",
    heroImage: img(g.image),
    body: [
      {
        _type: "richTextBlock",
        _key: key(),
        variant: "narrow",
        body: [p("[Guide text to be written. The mockup used template copy here.]")],
      },
    ],
  })),
];
