"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { withAutomaticRedirect } from "./sanity/actions/publishWithRedirect";
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env";
import { schemaTypes, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { helpTool } from "./sanity/tools/HelpTool";

const typesWithAddress = new Set(["page", "region", "place", "experience", "guide"]);

export default defineConfig({
  name: "default",
  title: "Travel Latvia",
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action));
      }
      if (typesWithAddress.has(schemaType)) {
        return actions.map((a) => (a.action === "publish" ? withAutomaticRedirect(a) : a));
      }
      return actions;
    },
    newDocumentOptions: (items, { creationContext }) =>
      creationContext.type === "global" ? items.filter((i) => !singletonTypes.has(i.templateId)) : items,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles.some((r) => r.name === "administrator");
    // Vision (query playground) is for developers only; everyone gets Help.
    return [...prev.filter((t) => t.name !== "vision" || isAdmin), helpTool];
  },
});
