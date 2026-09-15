import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/skeleton_loader.dart';
import '../providers/notifications_provider.dart';
import '../widgets/notification_tile.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(notificationsProvider.notifier).load();
    });
  }

  @override
  Widget build(BuildContext context) {
    final notifications = ref.watch(notificationsProvider);
    final hasUnread = notifications.unreadCount > 0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (hasUnread)
            TextButton(
              onPressed: () =>
                  ref.read(notificationsProvider.notifier).markAllRead(),
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: notifications.loading && notifications.items.isEmpty
          ? ListView(
              padding: const EdgeInsets.all(16),
              children: const [
                SkeletonLoader(height: 72),
                SizedBox(height: 12),
                SkeletonLoader(height: 72),
                SizedBox(height: 12),
                SkeletonLoader(height: 72),
              ],
            )
          : notifications.items.isEmpty
              ? EmptyState(
                  icon: Icons.notifications_off_outlined,
                  message: notifications.error ?? 'No notifications yet',
                )
              : RefreshIndicator(
                  onRefresh: () async =>
                      ref.read(notificationsProvider.notifier).load(force: true),
                  child: ListView.separated(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: notifications.items.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 4),
                    itemBuilder: (context, index) => NotificationTile(
                      notification: notifications.items[index],
                    ),
                  ),
                ),
      bottomNavigationBar: hasUnread
          ? SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  '${notifications.unreadCount} unread',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.labelMedium,
                ),
              ),
            )
          : null,
    );
  }
}