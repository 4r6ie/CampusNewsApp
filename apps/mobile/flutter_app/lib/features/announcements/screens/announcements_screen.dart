import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/skeleton_loader.dart';
import '../data/mock_announcements.dart';
import '../models/mock_announcement.dart';
import '../widgets/announcement_tile.dart';

class AnnouncementsScreen extends ConsumerStatefulWidget {
  const AnnouncementsScreen({super.key});

  @override
  ConsumerState<AnnouncementsScreen> createState() => _AnnouncementsScreenState();
}

class _AnnouncementsScreenState extends ConsumerState<AnnouncementsScreen> {
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

  List<MockAnnouncement> get _sorted {
    final list = mockAnnouncements();
    int rank(MockAnnouncement a) {
      if (a.priority == AnnouncementPriority.urgent) return 0;
      if (a.isPinned || a.priority == AnnouncementPriority.important) return 1;
      return 2;
    }

    list.sort((a, b) {
      final rankCompare = rank(a).compareTo(rank(b));
      if (rankCompare != 0) return rankCompare;
      return b.publishedAt.compareTo(a.publishedAt);
    });
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Announcements')),
      body: _loading
          ? ListView(
              padding: const EdgeInsets.all(16),
              children: const [
                SkeletonLoader(height: 90),
                SizedBox(height: 12),
                SkeletonLoader(height: 90),
                SizedBox(height: 12),
                SkeletonLoader(height: 90),
              ],
            )
          : RefreshIndicator(
              onRefresh: _simulateLoad,
              child: ListView.separated(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: _sorted.length,
                separatorBuilder: (_, __) => const SizedBox(height: 4),
                itemBuilder: (context, index) =>
                    AnnouncementTile(announcement: _sorted[index]),
              ),
            ),
    );
  }
}