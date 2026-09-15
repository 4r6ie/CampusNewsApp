import 'package:flutter/material.dart';

import '../../../shared/utils/relative_time.dart';
import '../models/announcement.dart';

class AnnouncementTile extends StatelessWidget {
  const AnnouncementTile({super.key, required this.announcement});

  final Announcement announcement;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final (background, foreground, label) = _priorityColors(colorScheme);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      color: background,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Color.lerp(background, foreground, 0.2)!,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    label,
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: foreground,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  formatRelativeTime(announcement.publishedAt),
                  style: theme.textTheme.bodySmall?.copyWith(color: foreground),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              announcement.title,
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text(
              announcement.body,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
              style: theme.textTheme.bodyMedium?.copyWith(color: foreground),
            ),
          ],
        ),
      ),
    );
  }

  (Color, Color, String) _priorityColors(ColorScheme colorScheme) {
    return switch (announcement.priority) {
      AnnouncementPriority.urgent => (
          colorScheme.errorContainer,
          colorScheme.onErrorContainer,
          'URGENT',
        ),
      AnnouncementPriority.high => (
          colorScheme.tertiaryContainer,
          colorScheme.onTertiaryContainer,
          'IMPORTANT',
        ),
      AnnouncementPriority.medium => (
          colorScheme.secondaryContainer,
          colorScheme.onSecondaryContainer,
          'UPDATE',
        ),
      AnnouncementPriority.low => (
          colorScheme.surfaceContainerHighest,
          colorScheme.onSurface,
          'NORMAL',
        ),
    };
  }
}