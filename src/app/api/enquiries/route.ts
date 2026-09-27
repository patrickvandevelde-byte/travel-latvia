import { type NextRequest, NextResponse } from "next/server";
import { sanityFetch } from "@/modules/content/client";
import { enquiryTargetQuery } from "@/modules/content/queries";
import { enquirySchema } from "@/modules/enquiries/schema";
import { notifyOwner, storeEnquiry } from "@/modules/enquiries/store";

/**
 * "Plan your journey" form (TRIP-01). Validates, drops honeypot hits quietly,
 * stores the enquiry in Sanity and emails the owner. When nothing is
 * configured yet it answers 503 so the form can fall back to a mailto: link.
 */
export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    if (fieldErrors.website) return NextResponse.json({ ok: true }); // bot: pretend success
    return NextResponse.json({ message: "Please check the form", errors: fieldErrors }, { status: 422 });
  }

  const stored = await storeEnquiry(parsed.data);
  if (!stored) {
    return NextResponse.json({ message: "Enquiries are not set up yet" }, { status: 503 });
  }
  const target = await sanityFetch(enquiryTargetQuery, {}, { tags: ["sanity:siteSettings"] });
  const notified = await notifyOwner(
    parsed.data,
    target?.enquiryNotificationEmail ?? target?.email,
    target?.siteName ?? "Baltique",
  );
  if (notified === "failed") console.error("Enquiry stored but owner email failed", stored.id);
  return NextResponse.json({ ok: true, id: stored.id });
}
