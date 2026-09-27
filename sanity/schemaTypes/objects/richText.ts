import { defineArrayMember, defineType } from "sanity";

/**
 * Body text. Headings start at H2 (the page title is H1) to keep a valid
 * heading order (NFR-03). No colours, fonts or raw HTML.
 */
export const portableText = defineType({
  name: "portableText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "Web address",
                type: "url",
                validation: (rule) => rule.uri({ allowRelative: true, scheme: ["https", "http", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "accessibleImage" }),
  ],
});
