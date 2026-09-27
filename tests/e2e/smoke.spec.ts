import { expect, test } from "@playwright/test";

const PAGES: [string, string][] = [
  ["/", "Baltique"],
  ["/services", "What we offer"],
  ["/guides", "Our curated guides"],
  ["/about", "Why I started"],
  ["/contact", "Contact us"],
];

test("every page has exactly one h1 with the mockup title and stays hidden from search engines", async ({ page }) => {
  for (const [path, title] of PAGES) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }), path).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 }), path).toHaveText(new RegExp(title));
    await expect(page.locator('meta[name="robots"]'), path).toHaveAttribute("content", /noindex/);
  }
});

test("main menu links to all five pages", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByText("Menu").click();
  const nav = page.getByRole("navigation", { name: "Main" }).filter({ visible: true });
  for (const label of ["Home", "Services", "Itineraries", "About", "Contact"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
  await nav.getByRole("link", { name: "Itineraries" }).click();
  await expect(page).toHaveURL(/\/guides$/);
});

test("skip link moves focus to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation is checked on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

test("enquiry form validates before sending and falls back to email when not wired up", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("form");
  await form.getByRole("button", { name: "Send" }).click();
  await expect(form.getByText("Please enter your name")).toBeVisible();
  await form.getByLabel("Full name").fill("Anna Jansen");
  await form.getByLabel("Email address").fill("anna@example.com");
  await form.getByLabel("What type of trip do you prefer?").selectOption("Hunting trip");
  // Without Sanity + a write token the API answers 503 and the form hands over to the visitor's email app.
  await form.getByRole("button", { name: "Send" }).click();
  await expect(form.getByRole("status")).toContainText(/email app|hear back/);
});

test("unknown pages return a friendly 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("Page not found")).toBeVisible();
});

test("robots.txt blocks crawling before launch and the sitemap lists the pages", async ({ request }) => {
  expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow: \//);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/services", "/about", "/contact", "/guides"]) expect(sitemap).toContain(path);
});

test("APIs reject bad input", async ({ request }) => {
  expect([401, 500]).toContain((await request.post("/api/revalidate", { data: { _type: "page" } })).status());
  expect((await request.post("/api/enquiries", { data: { name: "", email: "x" } })).status()).toBe(422);
  expect(
    (await request.post("/api/enquiries", { data: { name: "Bot", email: "b@x.io", website: "spam" } })).status(),
  ).toBe(200);
});
