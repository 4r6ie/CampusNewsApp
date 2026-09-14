import { execute, query, RowDataPacket } from '../../database/client';
import { AppError } from '../../middleware/error.middleware';

interface ReportRow extends RowDataPacket {
  id: string;
}

export class ReportService {
  static async create(reporterId: string, input: { targetType: string; targetId: string; reason: string }) {
    const result = await execute(
      `INSERT INTO reports (id, reporter_id, target_type, target_id, reason, status, created_at)
       VALUES (UUID(), ?, ?, ?, ?, 'pending', NOW())`,
      [reporterId, input.targetType, input.targetId, input.reason],
    );
    const rows = await query<ReportRow[]>('SELECT id FROM reports WHERE id = ?', [result.insertId.toString()]);
    return { id: rows[0].id };
  }

  static async updateStatus(reportId: string, status: string) {
    const result = await execute(
      'UPDATE reports SET status = ? WHERE id = ?',
      [status, reportId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'REPORT_NOT_FOUND', 'Report not found');
  }
}