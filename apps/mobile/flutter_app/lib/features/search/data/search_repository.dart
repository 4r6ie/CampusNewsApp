import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';
import '../models/search_result.dart';

class SearchResults {
  const SearchResults({required this.results});

  final List<SearchResult> results;
}

class SearchRepository {
  const SearchRepository({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<SearchResults> search(
    String query, {
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        '/search',
        queryParameters: {'q': query, 'page': page, 'limit': limit},
      );
      final data = response.data['data'] as Map<String, dynamic>;

      final posts = (data['posts'] as List<dynamic>? ?? const [])
          .map((json) => _fromPost(json as Map<String, dynamic>))
          .toList();
      final announcements = (data['announcements'] as List<dynamic>? ?? const [])
          .map((json) => _fromAnnouncement(json as Map<String, dynamic>))
          .toList();

      return SearchResults(results: [...posts, ...announcements]);
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  SearchResult _fromPost(Map<String, dynamic> json) {
    return SearchResult(
      id: json['id']?.toString() ?? '',
      type: SearchResultType.post,
      title: json['title']?.toString() ?? '',
      body: json['body']?.toString() ?? '',
      meta: json['category']?.toString().toUpperCase() ?? 'NEWS',
      publishedAt:
          DateTime.tryParse((json['publishedAt'] as String?) ?? '') ??
              DateTime.now(),
    );
  }

  SearchResult _fromAnnouncement(Map<String, dynamic> json) {
    return SearchResult(
      id: json['id']?.toString() ?? '',
      type: SearchResultType.announcement,
      title: json['title']?.toString() ?? '',
      body: json['body']?.toString() ?? '',
      meta: json['priority']?.toString().toUpperCase() ?? 'ANNOUNCEMENT',
      publishedAt:
          DateTime.tryParse((json['publishedAt'] as String?) ?? '') ??
              DateTime.now(),
    );
  }
}