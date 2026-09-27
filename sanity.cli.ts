import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "staging",
  },
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "./sanity/schema.json",
    generates: "./src/modules/content/sanity.types.ts",
    overloadClientMethods: true,
  },
});
