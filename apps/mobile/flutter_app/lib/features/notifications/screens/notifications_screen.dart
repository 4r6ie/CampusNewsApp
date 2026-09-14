import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/skeleton_loader.dart';
import '../data/mock_notifications.dart';
import '../models/mock_notification.dart';
import '../widgets/notification_tile.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  final List<MockNotificationItem> _items = mockNotifications();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _simulateLoad();
  }

  Future<void> _simulateLoad() async {
    setState(() => _loading = true);
    await Future<void>.delayed(const Duration(milliseconds: 400));
    if (mounted) setState(() => _loading = false);
  }

  bool get _hasUnread => _items.any((item) => !item.isRead);

  void _markAllRead() {
    setState(() {
      for (final item in _items) {
        item.isRead = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final unread = _items.where((item) => !item.isRead).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (_hasUnread)
            TextButton(
              onPressed: _markAllRead,
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: _loading
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
          : _items.isEmpty
              ? const EmptyState(
                  icon: Icons.notifications_off_outlined,
                  message: 'No notifications yet',
                )
              : RefreshIndicator(
                  onRefresh: _simulateLoad,
                  child: ListView.separated(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: _items.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 4),
                    itemBuilder: (context, index) =>
                        NotificationTile(notification: _items[index]),
                  ),
                ),
      bottomNavigationBar: _hasUnread
          ? SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  '$unread unread',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.labelMedium,
                ),
              ),
            )
          : null,
    );
  }
}