import { describe, expect, it } from "vitest";
import { enquirySchema } from "@/modules/enquiries/schema";

describe("enquiry validation", () => {
  it("accepts a normal enquiry", () => {
    const r = enquirySchema.safeParse({
      name: "Anna Jansen",
      email: "anna@example.com",
      phone: "",
      period: "October 2027",
      tripType: "Hunting trip",
      wishes: "Family of four",
    });
    expect(r.success).toBe(true);
  });
  it("rejects missing name or bad email", () => {
    const r = enquirySchema.safeParse({ name: "A", email: "not-an-email" });
    expect(r.success).toBe(false);
    const errs = r.success ? {} : r.error.flatten().fieldErrors;
    expect(errs.name?.[0]).toBe("Please enter your name");
    expect(errs.email?.[0]).toBe("Please enter a valid email address");
  });
  it("flags the honeypot", () => {
    const r = enquirySchema.safeParse({ name: "Bot", email: "bot@example.com", website: "http://spam" });
    expect(r.success).toBe(false);
  });
});
