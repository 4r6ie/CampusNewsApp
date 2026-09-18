import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'deleted']),
});

export const updatePostStatusSchema = z.object({
  status: z.enum(['published', 'archived', 'deleted']),
});

export const updateAnnouncementStatusSchema = z.object({
  status: z.enum(['published', 'expired', 'deleted']),
});

export const updateCommentStatusSchema = z.object({
  status: z.enum(['visible', 'hidden', 'deleted']),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']),
});

export const adminListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().max(100).optional(),
  status: z.string().max(20).optional(),
});