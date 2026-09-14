import '../models/mock_announcement.dart';

List<MockAnnouncement> mockAnnouncements() {
  final now = DateTime.now();
  return [
    MockAnnouncement(
      id: 'ann-001',
      title: 'URGENT: Suspension of Classes on Friday',
      body: 'Due to the incoming typhoon, all classes are suspended this Friday. '
          'Administrative offices will remain open. Stay indoors and follow '
          'official updates.',
      priority: AnnouncementPriority.urgent,
      publishedBy: 'Office of the President',
      publishedAt: now.subtract(const Duration(hours: 1)),
      isPinned: true,
    ),
    MockAnnouncement(
      id: 'ann-002',
      title: 'Deadline for Enrollment Confirmation',
      body: 'Please complete your enrollment confirmation before the end of the week. '
          'Students with incomplete requirements will be flagged by the Registrar.',
      priority: AnnouncementPriority.important,
      publishedBy: 'Registrar',
      publishedAt: now.subtract(const Duration(hours: 6)),
      isPinned: true,
    ),
    MockAnnouncement(
      id: 'ann-003',
      title: 'IT Services Window: Scheduled Maintenance',
      body: 'The campus network and portal will undergo maintenance on Saturday '
          'evening. Expect intermittent connectivity between 8 PM and midnight.',
      priority: AnnouncementPriority.normal,
      publishedBy: 'Information Technology Services',
      publishedAt: now.subtract(const Duration(days: 1)),
    ),
    MockAnnouncement(
      id: 'ann-004',
      title: 'Scholarship Application Update',
      body: 'The deadline for government scholarship applications has been extended '
          'by one week. Submit your requirements to the scholarship office.',
      priority: AnnouncementPriority.important,
      publishedBy: 'Scholarship Office',
      publishedAt: now.subtract(const Duration(days: 2)),
    ),
    MockAnnouncement(
      id: 'ann-005',
      title: 'Cafeteria Menu for the Week',
      body: 'Check out the weekly menu from the campus cafeteria, including new '
          'vegetarian options available daily at the second floor branch.',
      priority: AnnouncementPriority.normal,
      publishedBy: 'Cafeteria',
      publishedAt: now.subtract(const Duration(days: 3)),
    ),
  ];
}