import { z } from "zod";

/**
 * Environment validation (NFR-04). Variables are optional until the phase that
 * needs them; each integration reads its config through a getter that fails
 * loudly when that integration is used without configuration.
 */
const optional = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: optional.pipe(z.url().optional()),
  NEXT_PUBLIC_SANITY_PROJECT_ID: optional,
  NEXT_PUBLIC_SANITY_DATASET: optional,
  NEXT_PUBLIC_SANITY_API_VERSION: optional,
  SANITY_API_READ_TOKEN: optional,
  SANITY_REVALIDATE_SECRET: optional,
  NEXT_PUBLIC_GTM_ID: optional,
});

export type Env = z.infer<typeof schema>;

// NEXT_PUBLIC_* values must be referenced statically to be inlined in client bundles.
export const env: Env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
  SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
});

export const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** The public site stays out of search engines until launch (SEO-02). */
export const isIndexable = process.env.VERCEL_ENV === "production" && process.env.SITE_LAUNCHED === "true";
