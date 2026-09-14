import { z } from 'zod';

export const createReportSchema = z.object({
  targetType: z.enum(['post', 'comment', 'user']),
  targetId: z.string().min(1),
  reason: z.string().min(3).max(1000),
});