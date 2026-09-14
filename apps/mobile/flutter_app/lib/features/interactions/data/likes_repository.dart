import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';

class LikeResult {
  const LikeResult({required this.liked, required this.likeCount});

  final bool liked;
  final int likeCount;
}

class LikesRepository {
  const LikesRepository({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<LikeResult> like(String postId) async {
    try {
      final response = await _dio.post('/posts/$postId/likes');
      final data = response.data['data'] as Map<String, dynamic>;
      return LikeResult(
        liked: data['liked'] == true,
        likeCount: (data['count'] as num?)?.toInt() ?? 0,
      );
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<LikeResult> unlike(String postId) async {
    try {
      final response = await _dio.delete('/posts/$postId/likes');
      final data = response.data['data'] as Map<String, dynamic>;
      return LikeResult(
        liked: false,
        likeCount: (data['likeCount'] as num?)?.toInt() ?? 0,
      );
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }
}