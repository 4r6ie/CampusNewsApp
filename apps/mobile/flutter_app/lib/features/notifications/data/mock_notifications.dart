import '../models/mock_notification.dart';

List<MockNotificationItem> mockNotifications() {
  final now = DateTime.now();
  return [
    MockNotificationItem(
      id: 'notif-001',
      type: 'URGENT ANNOUNCEMENT',
      title: 'Classes Suspended on Friday',
      body: 'The Office of the President has suspended all classes due to the '
          'incoming typhoon.',
      createdAt: now.subtract(const Duration(hours: 1)),
    ),
    MockNotificationItem(
      id: 'notif-002',
      type: 'NEW NEWS',
      title: 'Intramurals 2026 Registration',
      body: 'Registration for Intramurals 2026 is now open for all departments.',
      createdAt: now.subtract(const Duration(hours: 2)),
    ),
    MockNotificationItem(
      id: 'notif-003',
      type: 'REMINDER',
      title: 'Enrollment Confirmation Due',
      body: 'Complete your enrollment confirmation before the end of the week.',
      createdAt: now.subtract(const Duration(hours: 10)),
      isRead: true,
    ),
    MockNotificationItem(
      id: 'notif-004',
      type: 'ADMIN BROADCAST',
      title: 'Network Maintenance Scheduled',
      body: 'The campus network will undergo maintenance on Saturday evening.',
      createdAt: now.subtract(const Duration(days: 1)),
      isRead: true,
    ),
  ];
}