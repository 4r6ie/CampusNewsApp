import '../../announcements/data/mock_announcements.dart';
import '../../feed/data/mock_posts.dart';
import '../models/mock_search_result.dart';

List<MockSearchResult> buildMockSearchResults() {
  return [
    ...mockPosts().map(
      (post) => MockSearchResult(
        id: post.id,
        type: SearchResultType.post,
        title: post.title,
        preview: post.body,
        meta: post.category,
      ),
    ),
    ...mockAnnouncements().map(
      (announcement) => MockSearchResult(
        id: announcement.id,
        type: SearchResultType.announcement,
        title: announcement.title,
        preview: announcement.body,
        meta: announcement.priorityLabel,
      ),
    ),
  ];
}