import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const publicaciones = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publicaciones' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    category: z.string().trim().min(1),
    cover: z.string().startsWith('/assets/'),
    authors: z.array(z.string().trim().min(1)).min(1),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(true),
    demo: z.boolean().default(false),
    readingMinutes: z.number().int().positive(),
  }),
});
export const collections = { publicaciones };
