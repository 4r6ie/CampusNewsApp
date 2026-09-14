import { z } from 'zod';

export const updateProfileSchema = z.object({
  studentNo: z.string().max(20).optional(),
  fullName: z.string().min(2).optional(),
  course: z.string().optional(),
  yearLevel: z.string().optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
});