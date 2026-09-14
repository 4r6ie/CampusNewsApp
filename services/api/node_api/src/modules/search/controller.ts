import { Response } from 'express';
import { z } from 'zod';
import { SearchService } from '../../services/search.service';
import { ok } from '../../utils/response';
import { getPagination } from '../../utils/pagination';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function search(req: AuthRequest, res: Response) {
  const { q } = z.object({ q: z.string().min(1) }).parse(req.query);
  const { offset, limit } = getPagination(req.query.page, req.query.limit);
  const results = await SearchService.search(q, { offset, limit });
  return ok(res, results);
}