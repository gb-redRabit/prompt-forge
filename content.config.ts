import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    prompts: defineCollection({
      type: "data",
      source: "prompts.json",
      schema: z.array(
        z.object({
          id: z.number(),
          type: z.string(),
          name: z.object({
            en: z.string(),
            pl: z.string(),
          }),
          description: z.object({
            en: z.string(),
            pl: z.string(),
          }),
          template: z.object({
            en: z.string(),
            pl: z.string(),
          }),
          placeholder_keys: z.array(z.string()),
          tags: z.array(z.string()),
          categories: z.array(z.string()),
        })
      ),
    }),
    options: defineCollection({
      type: "data",
      source: "options.json",
      schema: z.record(
        z.string(),
        z.array(
          z.object({
            value: z.string(),
            label: z.object({
              pl: z.string(),
              en: z.string(),
            }),
          })
        )
      ),
    }),
    tags: defineCollection({
      type: "data",
      source: "tagi.json",
      schema: z.array(
        z.object({
          pl: z.string(),
          en: z.string(),
          neg_pl: z.string(),
          neg_en: z.string(),
          category: z.string(),
          nsfw: z.boolean(),
        })
      ),
    }),
  },
});
