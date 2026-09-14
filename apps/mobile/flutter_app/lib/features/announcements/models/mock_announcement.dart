enum AnnouncementPriority { normal, important, urgent }

class MockAnnouncement {
  const MockAnnouncement({
    required this.id,
    required this.title,
    required this.body,
    required this.priority,
    required this.publishedBy,
    required this.publishedAt,
    this.isPinned = false,
  });

  final String id;
  final String title;
  final String body;
  final AnnouncementPriority priority;
  final String publishedBy;
  final DateTime publishedAt;
  final bool isPinned;

  String get priorityLabel => priority.name.toUpperCase();
}