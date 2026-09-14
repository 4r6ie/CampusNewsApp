import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().min(3).max(255),
  body: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  expiresAt: z.string().datetime().optional(),
});