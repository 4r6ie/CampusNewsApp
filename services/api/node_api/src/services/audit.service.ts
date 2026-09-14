// Audit logging for administrative and security actions.
import { execute } from '../database/client';
import { logger } from '../config/logger';

export class AuditService {
  static async log(action: string, input: {
    actorId?: string;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const { actorId, targetType, targetId, metadata } = input;

    await execute(
      `INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, metadata_json, created_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, NOW())`,
      [
        actorId ?? null,
        action,
        targetType ?? null,
        targetId ?? null,
        metadata ? JSON.stringify(metadata) : null,
      ],
    );

    logger.info(`Audit: ${action}`, { actorId, targetType, targetId });
  }
}