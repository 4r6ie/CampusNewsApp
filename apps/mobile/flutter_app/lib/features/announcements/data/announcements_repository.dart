import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';
import '../models/announcement.dart';

class AnnouncementsRepository {
  const AnnouncementsRepository({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<List<Announcement>> list({int page = 1, int limit = 50}) async {
    try {
      final response = await _dio.get(
        '/announcements',
        queryParameters: {'page': page, 'limit': limit},
      );
      final data = response.data['data'] as List<dynamic>;
      return data
          .map((json) => Announcement.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }
}