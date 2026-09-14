// Notification delivery via Firebase Cloud Messaging.
import { getFirebaseApp, isFirebaseConfigured } from '../config/firebase';
import { logger } from '../config/logger';

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
    // Resolve all active devices in production
    return this.sendMulticast([], title, body);
  }
}