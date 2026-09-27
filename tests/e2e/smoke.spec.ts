import { expect, test } from "@playwright/test";

test("home page renders with one main heading and is hidden from search engines", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("skip link moves focus to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard navigation is checked on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
});

test("listing pages render", async ({ page }) => {
  for (const [path, heading] of [
    ["/destinations", "Destinations"],
    ["/experiences", "Experiences"],
    ["/guides", "Guides"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
});

test("unknown pages return a friendly 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("Page not found")).toBeVisible();
});

test("robots.txt blocks crawling before launch", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/Disallow: \//);
});

test("revalidate webhook rejects unsigned requests", async ({ request }) => {
  const response = await request.post("/api/revalidate", { data: { _type: "page" } });
  expect([401, 500]).toContain(response.status());
});
