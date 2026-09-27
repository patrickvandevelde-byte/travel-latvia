import { describe, expect, it } from "vitest";
import { pathFor } from "@/modules/content/paths";

describe("pathFor", () => {
  it("builds paths per content type", () => {
    expect(pathFor({ _type: "homePage" })).toBe("/");
    expect(pathFor({ _type: "guidesPage" })).toBe("/guides");
    expect(pathFor({ _type: "page", slug: "summer-2027" })).toBe("/summer-2027");
    expect(pathFor({ _type: "region", slug: "vidzeme" })).toBe("/destinations/vidzeme");
    expect(pathFor({ _type: "place", slug: "sigulda", regionSlug: "vidzeme" })).toBe("/destinations/vidzeme/sigulda");
    expect(pathFor({ _type: "experience", slug: "riga-old-town-walk" })).toBe("/experiences/riga-old-town-walk");
    expect(pathFor({ _type: "guide", slug: "jani-midsummer" })).toBe("/guides/jani-midsummer");
  });

  it("returns null when a path can't be built", () => {
    expect(pathFor({ _type: "page" })).toBeNull();
    expect(pathFor({ _type: "place", slug: "sigulda" })).toBeNull();
    expect(pathFor({ _type: "author", slug: "x" })).toBeNull();
  });
});
