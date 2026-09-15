enum SearchResultType { post, announcement }

class SearchResult {
  const SearchResult({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    required this.meta,
    required this.publishedAt,
  });

  final String id;
  final SearchResultType type;
  final String title;
  final String body;
  final String meta;
  final DateTime publishedAt;

  String get typeLabel {
    return switch (type) {
      SearchResultType.post => 'News',
      SearchResultType.announcement => 'Announcement',
    };
  }
}