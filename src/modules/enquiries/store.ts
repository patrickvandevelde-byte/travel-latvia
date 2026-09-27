import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../../../sanity/env";
import type { EnquiryInput } from "./schema";

/**
 * Enquiries live in Sanity so the marketer sees them in the same workspace
 * as everything else (ADR-016). Volume is a handful per week.
 */
export type StoredEnquiry = { id: string; receivedAt: string };

export async function storeEnquiry(input: EnquiryInput): Promise<StoredEnquiry | null> {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isSanityConfigured || !token) return null;
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
  const receivedAt = new Date().toISOString();
  const doc = await client.create({
    _type: "enquiry",
    status: "new",
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    period: input.period || undefined,
    tripType: input.tripType || undefined,
    wishes: input.wishes || undefined,
    locale: input.locale || "en",
    sourcePath: input.sourcePath,
    receivedAt,
  });
  return { id: doc._id, receivedAt };
}

/** Email the owner. Uses Resend's REST API so no SDK is needed; silently skipped when not configured. */
export async function notifyOwner(
  input: EnquiryInput,
  to: string | null | undefined,
  siteName: string,
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || !to) return "skipped";
  const lines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.period ? `Travel period: ${input.period}` : null,
    input.tripType ? `Type of trip: ${input.tripType}` : null,
    "",
    input.wishes || "(no wishes given)",
  ].filter((l): l is string => l !== null);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: input.email,
      subject: `${siteName} enquiry from ${input.name}`,
      text: lines.join("\n"),
    }),
  });
  return res.ok ? "sent" : "failed";
}
