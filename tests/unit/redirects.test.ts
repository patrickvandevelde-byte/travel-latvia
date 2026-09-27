import { describe, expect, it } from "vitest";
import { buildRedirectMap, matchRedirect, normalisePath } from "@/modules/content/redirects";

describe("redirects", () => {
  it("normalises case, trailing slashes and query strings", () => {
    expect(normalisePath("/Tours/Riga-Walk/")).toBe("/tours/riga-walk");
    expect(normalisePath("tours?x=1")).toBe("/tours");
    expect(normalisePath("/")).toBe("/");
  });

  it("collapses chains and drops loops", () => {
    const map = buildRedirectMap([
      { from: "/a", to: "/b", permanent: true },
      { from: "/b", to: "/c", permanent: true },
      { from: "/x", to: "/y", permanent: true },
      { from: "/y", to: "/x", permanent: true },
      { from: "/self", to: "/self", permanent: true },
    ]);
    expect(map["/a"]).toEqual({ to: "/c", permanent: true });
    expect(map["/x"]).toBeUndefined();
    expect(map["/y"]).toBeUndefined();
    expect(map["/self"]).toBeUndefined();
  });

  it("keeps external targets and temporary flags", () => {
    const map = buildRedirectMap([{ from: "/partner", to: "https://example.com/Deal", permanent: false }]);
    expect(matchRedirect(map, "/Partner/")).toEqual({ to: "https://example.com/Deal", permanent: false });
    expect(matchRedirect(map, "/other")).toBeNull();
  });
});
