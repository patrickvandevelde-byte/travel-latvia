/**
 * Marketer handbook shown in the Studio "Help" tool (MKT-18, docs/08 §8).
 * One guide per task in docs/08 §4. Keep steps short and in plain language.
 * Add a guide whenever a marketer-facing feature ships (CLAUDE.md).
 */
export type HelpGuide = {
  task: string; // task ID from docs/08 §4
  title: string;
  steps: string[];
  tip?: string;
};

export const helpGuides: HelpGuide[] = [
  {
    task: "T1",
    title: "Change the home page hero",
    steps: [
      "Open Website → Home page.",
      "Click the Hero section in Page sections.",
      "Change the headline, intro or image. Every image needs alternative text.",
      "Check the preview, then click Publish.",
    ],
    tip: "Use a landscape photo at least 2000 px wide.",
  },
  {
    task: "T2",
    title: "Build a landing page",
    steps: [
      "Open Website → Landing & other pages and click the + button.",
      "Give the page a title. The web address is filled in for you.",
      "Under Page sections, click Add item and pick sections such as Hero, Experiences, Call to action.",
      "Drag sections to reorder them.",
      "Fill in the Search & social tab, then Publish.",
    ],
    tip: "A good campaign page has one Hero, one or two content sections and one Call to action.",
  },
  {
    task: "T3",
    title: "Publish a guide (blog post)",
    steps: [
      "Open Website → Guides (blog) and click +.",
      "Add a title, category, short summary and main image.",
      "Build the article from Text sections. Add an Experiences section to link bookable tours.",
      "Check the Search & social tab, then Publish.",
    ],
  },
  {
    task: "T4",
    title: "Add an experience",
    steps: [
      "Open Experiences → Experiences and click +.",
      "Fill in the Content tab: title, type, region, summary, at least 3 photos and the description.",
      "Fill in Practical info: duration, languages, meeting point on the map and a cancellation policy.",
      "Publish. Red warnings tell you exactly what is still missing.",
    ],
    tip: "Online booking and prices are added in a later phase.",
  },
  {
    task: "T19",
    title: "Handle a new enquiry",
    steps: [
      "Open Enquiries → New. Each form submission appears here, and you also get an email.",
      "Open the enquiry to read the traveller's wishes, then reply from your own email.",
      "Set the status (Replied, Quote sent, Booked or Not going ahead) and add notes for yourself.",
      "Publish to save the status. Nothing from an enquiry is ever shown on the website.",
    ],
  },
  {
    task: "T10",
    title: "Show an announcement bar",
    steps: [
      "Open Campaigns → Announcement bar.",
      "Write a short message and, if you want, add a link.",
      "Set 'Show from' and 'Hide after' so it switches on and off by itself.",
      "Turn on 'Show the announcement bar' and Publish.",
    ],
  },
  {
    task: "T11",
    title: "Edit the menu or footer",
    steps: [
      "Open Settings → Menu & footer.",
      "Add, remove or drag links in Main menu or Footer columns.",
      "Choose 'A page on this site' where possible: those links never break.",
      "Publish.",
    ],
  },
  {
    task: "T12",
    title: "Add a redirect",
    steps: [
      "Open SEO & redirects and click +.",
      "Old address: the path people still use, e.g. /tours/riga-walk.",
      "New address: where they should land, e.g. /experiences/riga-old-town-walk.",
      "Keep 'Permanent' on and Publish.",
    ],
    tip: "When you change a published page's web address, a redirect is created for you automatically.",
  },
  {
    task: "T13",
    title: "Improve how a page looks in Google",
    steps: [
      "Open the page and click the Search & social tab.",
      "Write a search title (30–60 characters) and description (70–160 characters).",
      "Add a social sharing image of 1200 × 630 px.",
      "Yellow warnings are advice; you can still publish.",
    ],
  },
  {
    task: "T21",
    title: "Undo a mistake",
    steps: [
      "Open the document and click the clock icon (History) at the top right.",
      "Pick an earlier version to see it.",
      "Click Restore, then Publish.",
    ],
  },
  {
    task: "T23",
    title: "Ask for a change the Studio can't do",
    steps: [
      "Write down what you need and why, in plain words.",
      "Send it to the support contact below. You will get a preview link to check before anything goes live.",
    ],
  },
];
