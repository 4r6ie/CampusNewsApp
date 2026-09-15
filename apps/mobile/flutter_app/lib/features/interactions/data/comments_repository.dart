import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';

class Comment {
  const Comment({
    required this.id,
    required this.postId,
    required this.authorId,
    required this.authorName,
    required this.content,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id']?.toString() ?? '',
      postId: json['postId']?.toString() ?? '',
      authorId: json['userId']?.toString() ?? '',
      authorName: json['fullName']?.toString() ?? '',
      content: json['body']?.toString() ?? '',
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? '') ??
          DateTime.now(),
    );
  }

  final String id;
  final String postId;
  final String authorId;
  final String authorName;
  final String content;
  final DateTime createdAt;
}

class CommentsResult {
  const CommentsResult({required this.comments, required this.hasMore});

  final List<Comment> comments;
  final bool hasMore;
}

class CommentsRepository {
  const CommentsRepository({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<CommentsResult> getComments(String postId, {int page = 1, int limit = 50}) async {
    try {
      final response = await _dio.get(
        '/posts/$postId/comments',
        queryParameters: {'page': page, 'limit': limit},
      );
      final data = response.data['data'] as List<dynamic>;
      final meta = response.data['meta'] as Map<String, dynamic>?;
      final comments =
          data.map((json) => Comment.fromJson(json as Map<String, dynamic>)).toList();
      final totalPages = (meta?['totalPages'] as num?)?.toInt() ?? 1;
      return CommentsResult(comments: comments, hasMore: page < totalPages);
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<Comment> addComment(String postId, {required String content}) async {
    try {
      final response = await _dio.post(
        '/posts/$postId/comments',
        data: {'body': content},
      );
      return Comment.fromJson(response.data['data'] as Map<String, dynamic>);
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<void> updateComment(String commentId, {required String content}) async {
    try {
      await _dio.patch(
        '/comments/$commentId',
        data: {'body': content},
      );
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<void> deleteComment(String commentId) async {
    try {
      await _dio.delete('/comments/$commentId');
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }
}