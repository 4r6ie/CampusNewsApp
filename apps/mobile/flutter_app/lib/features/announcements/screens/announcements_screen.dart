import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/announcement.dart';
import '../providers/announcements_provider.dart';
import '../widgets/announcement_tile.dart';

class AnnouncementsScreen extends ConsumerWidget {
  const AnnouncementsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final announcements = ref.watch(announcementsProvider);

    final expiredFiltered = announcements.announcements
        .where((a) => a.expiresAt == null || a.expiresAt!.isAfter(DateTime.now()))
        .toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Announcements')),
      body: _buildBody(
        ref,
        context,
        announcements.loading,
        expiredFiltered,
        announcements.error,
      ),
    );
  }

  Widget _buildBody(
    WidgetRef ref,
    BuildContext context,
    bool loading,
    List<Announcement> announcements,
    String? error,
  ) {
    final theme = Theme.of(context);

    if (loading && announcements.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (announcements.isEmpty) {
      return RefreshIndicator(
        onRefresh: () => ref.read(announcementsProvider.notifier).load(),
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            const SizedBox(height: 120),
            Center(
              child: Text(
                error ?? 'No announcements right now.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => ref.read(announcementsProvider.notifier).load(),
      child: ListView.separated(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: announcements.length,
        separatorBuilder: (_, __) => const SizedBox(height: 4),
        itemBuilder: (context, index) => AnnouncementTile(
          announcement: announcements[index],
        ),
      ),
    );
  }
}