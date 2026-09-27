import { PlayIcon } from "@sanity/icons/Play";
import { defineField, defineType } from "sanity";

export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  icon: PlayIcon,
  description: "A YouTube or Vimeo video. It only loads after the visitor accepts cookies for it.",
  fields: [
    defineField({
      name: "url",
      title: "Video link",
      type: "url",
      description: "Paste the YouTube or Vimeo page link.",
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            !value || /^(https:\/\/)(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(value)
              ? true
              : "Use a YouTube or Vimeo link",
          ),
    }),
    defineField({
      name: "title",
      title: "Video title",
      type: "string",
      description: "Read aloud by screen readers.",
      validation: (r) => r.required().max(100),
    }),
    defineField({ name: "poster", title: "Cover image", type: "accessibleImage" }),
  ],
  preview: {
    select: { title: "title", media: "poster" },
    prepare: ({ title, media }) => ({ title, subtitle: "Video", media }),
  },
});
