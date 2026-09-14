class MockPost {
  const MockPost({
    required this.id,
    required this.title,
    required this.body,
    required this.category,
    required this.authorName,
    required this.publishedAt,
    required this.likeCount,
    required this.commentCount,
  });

  final String id;
  final String title;
  final String body;
  final String category;
  final String authorName;
  final DateTime publishedAt;
  final int likeCount;
  final int commentCount;
}

const feedCategories = ['All', 'News', 'Events', 'Academic'];