import 'package:campus_news_app/features/announcements/data/announcements_repository.dart';
import 'package:campus_news_app/features/announcements/models/announcement.dart';
import 'package:campus_news_app/features/auth/data/auth_repository.dart';
import 'package:campus_news_app/features/auth/models/user.dart';
import 'package:campus_news_app/features/feed/data/feed_repository.dart';
import 'package:campus_news_app/features/feed/models/post.dart';
import 'package:campus_news_app/features/interactions/data/comments_repository.dart';
import 'package:campus_news_app/features/notifications/data/notifications_repository.dart';
import 'package:campus_news_app/features/notifications/models/app_notification.dart';
import 'package:campus_news_app/features/search/data/search_repository.dart';
import 'package:campus_news_app/features/search/models/search_result.dart';
import 'package:campus_news_app/core/storage/token_storage.dart';
import 'package:dio/dio.dart';

class FakeTokenStorage extends TokenStorage {
  String? access;
  String? refresh;

  @override
  Future<String?> readAccessToken() async => access;

  @override
  Future<void> writeAccessToken(String token) async => access = token;

  @override
  Future<String?> readRefreshToken() async => refresh;

  @override
  Future<void> writeRefreshToken(String token) async => refresh = token;

  @override
  Future<void> clear() async {
    access = null;
    refresh = null;
  }
}

class FakeAuthRepository extends AuthRepository {
  FakeAuthRepository() : super(dio: Dio(), storage: FakeTokenStorage());

  static final juan = User(
    id: 'u-0001',
    email: 'student@campus.edu',
    role: UserRole.student,
    fullName: 'Juan Dela Cruz',
  );

  @override
  Future<AuthResult> login({
    required String email,
    required String password,
  }) async {
    return AuthResult(user: juan, accessToken: 'access-token', refreshToken: 'refresh-token');
  }

  @override
  Future<AuthResult> register({
    required String fullName,
    required String email,
    required String password,
    String? studentNo,
  }) async {
    return AuthResult(user: juan, accessToken: 'access-token', refreshToken: 'refresh-token');
  }

  @override
  Future<User?> refresh() async => null;

  @override
  Future<void> logout() async {}
}

class FakeFeedRepository extends FeedRepository {
  FakeFeedRepository() : super(dio: Dio());

  final List<Post> posts = _buildPosts();

  static List<Post> _buildPosts() {
    final now = DateTime.now();
    return [
      Post(
        id: 'post-001',
        authorId: 'a-001',
        authorName: 'Student Affairs Office',
        title: 'Intramurals 2026: Registration Now Open',
        body: 'Registration for Intramurals 2026 is open.',
        category: PostCategory.event,
        publishedAt: now.subtract(const Duration(hours: 2)),
        likeCount: 128,
        commentCount: 24,
        likedByMe: false,
      ),
      Post(
        id: 'post-002',
        authorId: 'a-002',
        authorName: 'Registrar',
        title: 'Midterm Exam Schedule Released',
        body: 'Official midterm exam schedule is now available.',
        category: PostCategory.academic,
        publishedAt: now.subtract(const Duration(hours: 5)),
        likeCount: 86,
        commentCount: 41,
        likedByMe: false,
      ),
      Post(
        id: 'post-004',
        authorId: 'a-003',
        authorName: 'Facilities & Transport',
        title: 'Campus Shuttle Schedule Updated',
        body: 'The campus shuttle runs every 15 minutes during peak hours.',
        category: PostCategory.news,
        publishedAt: now.subtract(const Duration(days: 2)),
        likeCount: 31,
        commentCount: 8,
        likedByMe: false,
      ),
    ];
  }

  @override
  Future<FeedResult> getFeed({
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    final filtered = category == null
        ? posts
        : posts.where((p) => p.category.name == category).toList();
    return FeedResult(posts: filtered, hasMore: false);
  }

  @override
  Future<Post> getPost(String postId) async {
    return posts.firstWhere((p) => p.id == postId);
  }
}

class FakeAnnouncementsRepository extends AnnouncementsRepository {
  FakeAnnouncementsRepository() : super(dio: Dio());

  @override
  Future<List<Announcement>> list({int page = 1, int limit = 50}) async {
    final now = DateTime.now();
    return [
      Announcement(
        id: 'ann-001',
        title: 'URGENT: Suspension of Classes on Friday',
        body: 'Due to the incoming typhoon, all classes are suspended this Friday.',
        priority: AnnouncementPriority.urgent,
        publishedAt: now.subtract(const Duration(hours: 1)),
      ),
      Announcement(
        id: 'ann-002',
        title: 'Deadline for Enrollment Confirmation',
        body: 'Complete your enrollment confirmation before the end of the week.',
        priority: AnnouncementPriority.high,
        publishedAt: now.subtract(const Duration(hours: 6)),
      ),
      Announcement(
        id: 'ann-003',
        title: 'IT Services Window: Scheduled Maintenance',
        body: 'Campus network maintenance on Saturday evening.',
        priority: AnnouncementPriority.low,
        publishedAt: now.subtract(const Duration(days: 1)),
      ),
    ];
  }
}

class FakeCommentsRepository extends CommentsRepository {
  FakeCommentsRepository() : super(dio: Dio());

  final List<Comment> comments = [];

  @override
  Future<CommentsResult> getComments(
    String postId, {
    int page = 1,
    int limit = 50,
  }) async {
    final filtered = comments.where((c) => c.postId == postId).toList();
    return CommentsResult(comments: filtered, hasMore: false);
  }

  @override
  Future<Comment> addComment(String postId, {required String content}) async {
    final comment = Comment(
      id: 'c-${comments.length + 1}',
      postId: postId,
      authorId: FakeAuthRepository.juan.id,
      authorName: FakeAuthRepository.juan.displayName,
      content: content,
      createdAt: DateTime.now(),
    );
    comments.add(comment);
    return comment;
  }

  @override
  Future<void> updateComment(
    String commentId, {
    required String content,
  }) async {
    final index = comments.indexWhere((c) => c.id == commentId);
    if (index == -1) return;
    final existing = comments[index];
    comments[index] = Comment(
      id: existing.id,
      postId: existing.postId,
      authorId: existing.authorId,
      authorName: existing.authorName,
      content: content,
      createdAt: existing.createdAt,
    );
  }

  @override
  Future<void> deleteComment(String commentId) async {
    comments.removeWhere((c) => c.id == commentId);
  }
}

class FakeSearchRepository extends SearchRepository {
  FakeSearchRepository() : super(dio: Dio());

  @override
  Future<SearchResults> search(
    String query, {
    int page = 1,
    int limit = 20,
  }) async {
    final now = DateTime.now();
    final all = [
      SearchResult(
        id: 'post-001',
        type: SearchResultType.post,
        title: 'Intramurals 2026: Registration Now Open',
        body: 'Registration for Intramurals 2026 is open for all students.',
        meta: 'EVENT',
        publishedAt: now.subtract(const Duration(hours: 2)),
      ),
      SearchResult(
        id: 'post-002',
        type: SearchResultType.post,
        title: 'Midterm Exam Schedule Released',
        body: 'Official midterm exam schedule is now available.',
        meta: 'ACADEMIC',
        publishedAt: now.subtract(const Duration(hours: 5)),
      ),
      SearchResult(
        id: 'ann-001',
        type: SearchResultType.announcement,
        title: 'URGENT: Suspension of Classes on Friday',
        body: 'Due to the incoming typhoon, all classes are suspended.',
        meta: 'URGENT',
        publishedAt: now.subtract(const Duration(hours: 1)),
      ),
    ];
    final lower = query.toLowerCase();
    final results = all
        .where((r) =>
            r.title.toLowerCase().contains(lower) ||
            r.body.toLowerCase().contains(lower))
        .toList();
    return SearchResults(results: results);
  }
}

class FakeNotificationsRepository extends NotificationsRepository {
  FakeNotificationsRepository() : super(dio: Dio());

  final List<AppNotification> items = [];
  final List<String> markedRead = [];

  void seed() {
    final now = DateTime.now();
    items
      ..add(AppNotification(
        id: 'n-001',
        type: 'URGENT_ANNOUNCEMENT',
        title: 'URGENT: Suspension of Classes on Friday',
        body: 'Due to the incoming typhoon, all classes are suspended this Friday.',
        createdAt: now.subtract(const Duration(hours: 1)),
      ))
      ..add(AppNotification(
        id: 'n-002',
        type: 'NEW NEWS',
        title: 'Intramurals 2026: Registration Now Open',
        body: 'Registration for Intramurals 2026 is open for all students.',
        createdAt: now.subtract(const Duration(hours: 2)),
        readAt: now.subtract(const Duration(hours: 1)),
      ));
  }

  @override
  Future<List<AppNotification>> fetchNotifications({
    int page = 1,
    int limit = 30,
  }) async {
    if (items.isEmpty) seed();
    return List.of(items);
  }

  @override
  Future<void> markRead(String id, {required bool read}) async {
    markedRead.add(id);
    final index = items.indexWhere((n) => n.id == id);
    if (index == -1) return;
    final existing = items[index];
    items[index] = AppNotification(
      id: existing.id,
      type: existing.type,
      title: existing.title,
      body: existing.body,
      createdAt: existing.createdAt,
      readAt: read ? (existing.readAt ?? DateTime.now()) : null,
    );
  }
}