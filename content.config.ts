import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    realisations: defineCollection({
      type: 'page',
      source: 'realisations/**/*.md',
      schema: z.object({
        slug: z.string(),
        language: z.enum(['fr', 'en']),
        client: z.string(),
        sector: z.string(),
        technologies: z.array(z.string()),
        link: z.string().url(),
        summary: z.string(),
        featured: z.boolean()
      })
    })
  }
})