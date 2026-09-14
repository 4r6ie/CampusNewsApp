import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';
import '../models/post.dart';

class FeedResult {
  const FeedResult({required this.posts, required this.hasMore});

  final List<Post> posts;
  final bool hasMore;
}

class FeedRepository {
  const FeedRepository({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<FeedResult> getFeed({
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '/posts',
        queryParameters: {
          'page': page,
          'limit': limit,
          if (category != null) 'category': category,
        },
      );
      final data = response.data['data'] as List<dynamic>;
      final meta = response.data['meta'] as Map<String, dynamic>?;
      final posts = data.map((json) => Post.fromJson(json as Map<String, dynamic>)).toList();
      final totalPages = (meta?['totalPages'] as num?)?.toInt() ?? 1;
      return FeedResult(posts: posts, hasMore: page < totalPages);
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<Post> getPost(String postId) async {
    try {
      final response = await _dio.get('/posts/$postId');
      return Post.fromJson(response.data['data'] as Map<String, dynamic>);
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }
}