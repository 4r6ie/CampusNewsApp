import '../models/mock_post.dart';

List<MockPost> mockPosts() {
  final now = DateTime.now();
  return [
    MockPost(
      id: 'post-001',
      title: 'Intramurals 2026: Registration Now Open',
      body: 'The registration for Intramurals 2026 is officially open. All departments '
          'are encouraged to organize their teams for basketball, volleyball, and e-sports. '
          'Deadline of roster submission is on the last Friday of the month.',
      category: 'Events',
      authorName: 'Student Affairs Office',
      publishedAt: now.subtract(const Duration(hours: 2)),
      likeCount: 128,
      commentCount: 24,
    ),
    MockPost(
      id: 'post-002',
      title: 'Midterm Exam Schedule Released',
      body: 'The official midterm examination schedule for the current term is now '
          'available. Please check your email for the detailed room assignments and '
          'holiday adjustments.',
      category: 'Academic',
      authorName: 'Registrar',
      publishedAt: now.subtract(const Duration(hours: 5)),
      likeCount: 86,
      commentCount: 41,
    ),
    MockPost(
      id: 'post-003',
      title: 'New Library Hours Starting Monday',
      body: 'The University Library will extend its operating hours beginning next week '
          'to support late-night study sessions during the exam period. Study rooms can '
          'now be reserved online.',
      category: 'News',
      authorName: 'University Library',
      publishedAt: now.subtract(const Duration(days: 1)),
      likeCount: 53,
      commentCount: 12,
    ),
    MockPost(
      id: 'post-004',
      title: 'Campus Shuttle Schedule Updated',
      body: 'The campus shuttle now runs every 15 minutes between Main Gate and the '
          'Academic Complex during peak hours. A revised timetable is posted at all '
          'shuttle stops.',
      category: 'News',
      authorName: 'Facilities & Transport',
      publishedAt: now.subtract(const Duration(days: 2)),
      likeCount: 31,
      commentCount: 8,
    ),
    MockPost(
      id: 'post-005',
      title: 'Research Symposium Call for Papers',
      body: 'Submit your abstract to the Annual Research Symposium. Undergraduate and '
          'graduate students across all colleges are invited to present their research. '
          'Selected papers will be published in the university journal.',
      category: 'Academic',
      authorName: 'Research Office',
      publishedAt: now.subtract(const Duration(days: 3)),
      likeCount: 74,
      commentCount: 19,
    ),
    MockPost(
      id: 'post-006',
      title: 'Annual Cultural Festival Lineup Revealed',
      body: 'The Cultural Festival returns with performances from various student '
          'organizations. Enjoy live music, dance showcases, food stalls, and the '
          'traditional street parade around the campus oval.',
      category: 'Events',
      authorName: 'Cultural Affairs',
      publishedAt: now.subtract(const Duration(days: 4)),
      likeCount: 210,
      commentCount: 57,
    ),
  ];
}