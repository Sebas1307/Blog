import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		category: z.array(z.string()),
	})
});

const videos = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		url: z.string(),
		category: z.string(),
		tags: z.array(z.string())
	})
});

const roadmaps = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		category: z.string(),
		steps: z.array(z.object({
			title: z.string(),
			description: z.string(),
			content: z.string().optional(),
			videoUrl: z.string().url().optional()
		}))
	})
});

export const collections = { blog, videos, roadmaps }; 