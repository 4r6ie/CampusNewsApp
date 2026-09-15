// Notification delivery via Firebase Cloud Messaging plus in-app rows.
import { query, execute, RowDataPacket } from '../database/client';
import { getFirebaseApp, isFirebaseConfigured } from '../config/firebase';
import { logger } from '../config/logger';

interface UserIdRow extends RowDataPacket {
  id: string;
}

interface TokenRow extends RowDataPacket {
  token: string;
}

export class NotificationService {
  static async sendMulticast(tokens: string[], title: string, body: string) {
    if (!isFirebaseConfigured()) {
      logger.warn('Firebase not configured; skipping push send');
      return { successCount: 0, failureCount: tokens.length };
    }

    const messaging = getFirebaseApp().messaging();
    const result = await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
    });

    return {
      successCount: result.successCount,
      failureCount: result.failureCount,
    };
  }

  static async broadcast(title: string, body: string) {
    const users = await query<UserIdRow[]>(
      "SELECT id FROM users WHERE status = 'active'",
    );

    for (const user of users) {
      await execute(
        `INSERT INTO notifications (id, user_id, type, title, body, created_at)
         VALUES (UUID(), ?, 'URGENT_ANNOUNCEMENT', ?, ?, NOW())`,
        [user.id, title, body],
      );
    }

    const tokenRows = await query<TokenRow[]>(
      `SELECT d.token FROM devices d
       JOIN users u ON u.id = d.user_id
       WHERE d.active = TRUE AND u.status = 'active'`,
    );

    const push = await this.sendMulticast(
      tokenRows.map((row) => row.token),
      title,
      body,
    );

    return { ...push, notifications: users.length };
  }
}