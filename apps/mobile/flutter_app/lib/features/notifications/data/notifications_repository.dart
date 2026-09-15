import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';
import '../models/app_notification.dart';

class NotificationsRepository {
  const NotificationsRepository({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<List<AppNotification>> fetchNotifications({
    int page = 1,
    int limit = 30,
  }) async {
    try {
      final response = await _dio.get('/notifications', queryParameters: {
        'page': page,
        'limit': limit,
      });
      final items = response.data['data'] as List<dynamic>? ?? const [];
      return items
          .map((json) => AppNotification.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<void> markRead(String id, {required bool read}) async {
    try {
      await _dio.patch('/notifications/$id/read', data: {'read': read});
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }
}