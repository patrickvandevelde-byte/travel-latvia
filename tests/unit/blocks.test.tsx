import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Blocks } from "@/components/blocks/Blocks";
import type { Section } from "@/modules/content/types";

const image = {
  asset: { _ref: "image-abc123-2000x1200-jpg", _type: "reference" },
  hotspot: null,
  crop: null,
  alt: "Gauja river valley in autumn",
  credit: null,
};
const link = {
  label: "Explore Vidzeme",
  kind: "internal",
  external: null,
  internal: { _type: "region", slug: "vidzeme", regionSlug: null },
};
const card = {
  _id: "exp1",
  title: "Gauja National Park, Sigulda & Cēsis day trip",
  slug: "gauja-day-trip",
  summary: "Castles and sandstone cliffs.",
  durationMinutes: 540,
  priceFromCents: 8900,
  badges: ["bestseller"],
  region: "Vidzeme",
  image,
};
const text = [
  {
    _type: "block",
    _key: "b1",
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "s1", text: "Rīga is best explored on foot.", marks: [] }],
  },
];

const sections = [
  {
    _type: "heroBlock",
    _key: "h",
    variant: "image",
    eyebrow: "Summer 2027",
    headline: "Discover Latvia",
    intro: "Forests, coast and Art Nouveau.",
    image,
    actions: [link],
  },
  { _type: "richTextBlock", _key: "r", variant: "narrow", body: text },
  {
    _type: "experienceGridBlock",
    _key: "e",
    heading: "Popular day trips",
    variant: "grid",
    mode: "manual",
    experiences: [],
    region: null,
    limit: null,
    items: [card],
  },
  {
    _type: "destinationCardsBlock",
    _key: "d",
    heading: "Regions",
    items: [
      {
        _id: "r1",
        _type: "region",
        title: "Vidzeme",
        slug: "vidzeme",
        regionSlug: null,
        summary: "Latvia's green heart.",
        image,
      },
    ],
  },
  {
    _type: "ctaBandBlock",
    _key: "c",
    variant: "forest",
    headline: "Plan a tailor-made trip",
    text: null,
    action: link,
  },
  { _type: "galleryBlock", _key: "g", heading: null, images: [image, image] },
  {
    _type: "testimonialsBlock",
    _key: "t",
    heading: "What travellers say",
    items: [
      {
        _key: "t1",
        _type: "testimonial",
        quote: "The bog walk at sunrise was magical.",
        author: "Anna",
        origin: "Berlin",
      },
    ],
  },
  {
    _type: "faqBlock",
    _key: "f",
    heading: "FAQ",
    items: [{ _key: "q1", _type: "faqItem", question: "Do I need a car?", answer: text }],
  },
  {
    _type: "statsBlock",
    _key: "s",
    heading: null,
    items: [{ _key: "s1", _type: "stat", value: "500 km", label: "of Baltic coastline" }],
  },
  { _type: "videoBlock", _key: "v", url: "https://www.youtube.com/watch?v=x", title: "Jāņi in Latvia", poster: image },
  { _type: "spacerBlock", _key: "sp", size: "large", divider: true },
] as unknown as Section[];

describe("Blocks", () => {
  const html = renderToStaticMarkup(<Blocks sections={sections} />);

  it("renders every block type with its content", () => {
    for (const expected of [
      "Discover Latvia",
      "Rīga is best explored on foot.",
      "Gauja National Park, Sigulda &amp; Cēsis day trip",
      "Latvia&#x27;s green heart.",
      "Plan a tailor-made trip",
      "The bog walk at sunrise was magical.",
      "Do I need a car?",
      "500 km",
      "Watch: Jāņi in Latvia",
    ]) {
      expect(html).toContain(expected);
    }
  });

  it("makes the first hero the page's h1 and resolves CMS links", () => {
    expect(html).toMatch(/<h1[^>]*>Discover Latvia<\/h1>/);
    expect(html).toContain('href="/destinations/vidzeme"');
    expect(html).toContain('href="/experiences/gauja-day-trip"');
  });

  it("shows prices in euros and durations in hours", () => {
    expect(html).toContain("€89");
    expect(html).toContain("9 h");
  });

  it("requires alt text on images", () => {
    expect(html).toContain('alt="Gauja river valley in autumn"');
  });

  it("skips unknown block types instead of crashing", () => {
    const out = renderToStaticMarkup(
      <Blocks sections={[{ _type: "futureBlock", _key: "x" }] as unknown as Section[]} />,
    );
    expect(out).toBe("");
  });
});
