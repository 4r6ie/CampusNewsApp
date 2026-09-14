enum SearchResultType { post, announcement }

class MockSearchResult {
  const MockSearchResult({
    required this.id,
    required this.type,
    required this.title,
    required this.preview,
    required this.meta,
  });

  final String id;
  final SearchResultType type;
  final String title;
  final String preview;
  final String meta;

  String get typeLabel => type == SearchResultType.post ? 'Post' : 'Announcement';
}