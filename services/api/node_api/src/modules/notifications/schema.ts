import { z } from 'zod';

export const markReadSchema = z.object({
  read: z.boolean().default(true),
});