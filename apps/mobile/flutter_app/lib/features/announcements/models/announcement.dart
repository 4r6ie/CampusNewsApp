enum AnnouncementPriority { urgent, high, medium, low }

AnnouncementPriority announcementPriorityFromString(String value) {
  return switch (value) {
    'urgent' => AnnouncementPriority.urgent,
    'high' => AnnouncementPriority.high,
    'medium' => AnnouncementPriority.medium,
    _ => AnnouncementPriority.low,
  };
}

class Announcement {
  const Announcement({
    required this.id,
    required this.title,
    required this.body,
    required this.priority,
    required this.publishedAt,
    this.expiresAt,
  });

  factory Announcement.fromJson(Map<String, dynamic> json) {
    return Announcement(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      body: json['body']?.toString() ?? '',
      priority: announcementPriorityFromString(json['priority']?.toString() ?? 'low'),
      publishedAt: DateTime.tryParse(json['publishedAt']?.toString() ?? '') ??
          DateTime.now(),
      expiresAt: DateTime.tryParse(json['expiresAt']?.toString() ?? ''),
    );
  }

  final String id;
  final String title;
  final String body;
  final AnnouncementPriority priority;
  final DateTime publishedAt;
  final DateTime? expiresAt;

  String get priorityLabel => priority.name.toUpperCase();
}