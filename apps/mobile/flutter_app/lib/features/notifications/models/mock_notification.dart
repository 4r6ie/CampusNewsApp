class MockNotificationItem {
  MockNotificationItem({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    required this.createdAt,
    this.isRead = false,
  });

  final String id;
  final String type;
  final String title;
  final String body;
  final DateTime createdAt;
  bool isRead;
}