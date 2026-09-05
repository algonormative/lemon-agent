import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lists = defineCollection({
  loader: glob({ pattern: '*.md', base: './lists' }),
  schema: z.object({
    title: z.string(),
    number: z.number(),
    surface: z.string(),
    arm: z.enum(['taste', 'verification']),
    entries: z.number(),
    prefix: z.string(),
    status: z.enum(['draft', 'published']),
    updated: z.coerce.date(),
    description: z.string(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './guides' }),
  schema: z.object({
    title: z.string(),
    step: z.number(),
    status: z.enum(['draft', 'published']),
    updated: z.coerce.date(),
    description: z.string(),
  }),
});

const start = defineCollection({
  loader: glob({ pattern: '*.md', base: './start' }),
  schema: z.object({
    title: z.string(),
    step: z.number(),
    minutes: z.number(),
    description: z.string(),
  }),
});

const craft = defineCollection({
  loader: glob({ pattern: '*.md', base: './craft' }),
  schema: z.object({
    title: z.string(),
    craft: z.string(),
    kind: z.enum(['craft', 'instrument']).default('craft'),
    status: z.enum(['scoping', 'v0', 'published']),
    updated: z.coerce.date(),
    description: z.string(),
  }),
});

// One file per correction. The six fields the /corrections page renders are
// the record: when, what was claimed, where it was said, what was wrong,
// what is true now, and which internal record says so. The body is optional
// and carries a short note when one is needed.
const corrections = defineCollection({
  loader: glob({ pattern: '*.md', base: './corrections' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    claimed: z.string(),
    where: z.string(),
    wrong: z.string(),
    now: z.string(),
    source: z.string(),
  }),
});

export const collections = { lists, guides, start, craft, corrections };
