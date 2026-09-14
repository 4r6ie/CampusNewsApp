enum PostCategory { news, event, academic, general }

PostCategory postCategoryFromString(String value) {
  return switch (value) {
    'news' => PostCategory.news,
    'event' => PostCategory.event,
    'academic' => PostCategory.academic,
    _ => PostCategory.general,
  };
}

String postCategoryToApi(PostCategory category) => category.name;

class Post {
  const Post({
    required this.id,
    required this.authorId,
    required this.authorName,
    required this.title,
    required this.body,
    required this.category,
    required this.publishedAt,
    required this.likeCount,
    required this.commentCount,
    required this.likedByMe,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id']?.toString() ?? '',
      authorId: json['authorId']?.toString() ?? '',
      authorName: json['authorName']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      body: json['body']?.toString() ?? '',
      category: postCategoryFromString(json['category']?.toString() ?? 'general'),
      publishedAt: DateTime.tryParse(json['publishedAt']?.toString() ?? '') ??
          DateTime.now(),
      likeCount: (json['likeCount'] as num?)?.toInt() ?? 0,
      commentCount: (json['commentCount'] as num?)?.toInt() ?? 0,
      likedByMe: json['likedByMe'] == true || json['likedByMe'] == 1,
    );
  }

  final String id;
  final String authorId;
  final String authorName;
  final String title;
  final String body;
  final PostCategory category;
  final DateTime publishedAt;
  final int likeCount;
  final int commentCount;
  final bool likedByMe;

  String get categoryLabel {
    return switch (category) {
      PostCategory.news => 'News',
      PostCategory.event => 'Events',
      PostCategory.academic => 'Academic',
      PostCategory.general => 'General',
    };
  }

  Post copyWith({int? likeCount, int? commentCount, bool? likedByMe}) {
    return Post(
      id: id,
      authorId: authorId,
      authorName: authorName,
      title: title,
      body: body,
      category: category,
      publishedAt: publishedAt,
      likeCount: likeCount ?? this.likeCount,
      commentCount: commentCount ?? this.commentCount,
      likedByMe: likedByMe ?? this.likedByMe,
    );
  }
}