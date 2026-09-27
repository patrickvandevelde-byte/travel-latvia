import { describe, expect, it } from "vitest";
import { demoFetch, demoImageUrl } from "@/modules/content/demo";
import { homePageQuery, pageQuery, settingsQuery } from "@/modules/content/queries";

describe("demo content", () => {
  it("answers the real GROQ queries from the seed", async () => {
    const settings = await demoFetch<{
      siteName: string;
      mainMenu: { label: string; internal: { slug: string | null } }[];
    }>(settingsQuery);
    expect(settings.siteName).toBe("Baltique");
    expect(settings.mainMenu.map((m) => m.label)).toEqual(["Home", "Services", "Itineraries", "About", "Contact"]);
    expect(settings.mainMenu[1].internal.slug).toBe("services");

    const home = await demoFetch<{ sections: { _type: string; items?: unknown[] }[] }>(homePageQuery);
    expect(home.sections[0]._type).toBe("heroBlock");
    const guides = home.sections.find((s) => s._type === "guideListBlock");
    expect(guides?.items).toHaveLength(5);

    const contact = await demoFetch<{ title: string } | null>(pageQuery, { slug: "contact" });
    expect(contact?.title).toBe("Contact us");
  });

  it("maps demo image refs to local files and leaves real refs alone", () => {
    expect(demoImageUrl("image-demo-heroLake")).toBe("/images/brief/hero-aerial-lake.jpg");
    expect(demoImageUrl("image-abc123-2000x1200-jpg")).toBeNull();
  });
});
