import { execute, query, RowDataPacket } from '../../database/client';
import { AppError } from '../../middleware/error.middleware';

interface DeviceRow extends RowDataPacket {
  id: string;
  token: string;
  platform: string;
}

export class DeviceService {
  static async register(userId: string, token: string, platform: string): Promise<DeviceRow> {
    await execute(
      `INSERT INTO devices (id, user_id, token, platform, active, last_seen_at, created_at)
       VALUES (UUID(), ?, ?, ?, TRUE, NOW(), NOW())
       ON DUPLICATE KEY UPDATE last_seen_at = NOW()`,
      [userId, token, platform],
    );
    const rows = await query<DeviceRow[]>(
      'SELECT id, token, platform FROM devices WHERE token = ?',
      [token],
    );
    return rows[0];
  }

  static async remove(userId: string, deviceId: string) {
    const result = await execute(
      `UPDATE devices SET active = FALSE WHERE id = ? AND user_id = ?`,
      [deviceId, userId],
    );
    if (result.affectedRows === 0) throw new AppError(404, 'DEVICE_NOT_FOUND', 'Device not found');
  }
}