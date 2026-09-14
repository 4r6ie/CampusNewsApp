import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3).max(255),
  body: z.string().min(1),
  category: z.enum(['news', 'event', 'academic', 'general']).default('general'),
});

export const updatePostSchema = createPostSchema.partial();