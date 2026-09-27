import { z } from "zod";

/** Validation shared by the form (client) and the API route (server). */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  period: z.string().trim().max(120).optional().or(z.literal("")),
  tripType: z.string().trim().max(60).optional().or(z.literal("")),
  wishes: z.string().trim().max(4000).optional().or(z.literal("")),
  sourcePath: z.string().max(200).optional(),
  locale: z.string().max(10).optional(),
  // Honeypot: real people never fill this hidden field.
  website: z.string().max(0, "Spam check failed").optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
