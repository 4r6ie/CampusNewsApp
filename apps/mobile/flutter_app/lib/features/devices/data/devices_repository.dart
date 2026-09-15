import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';

class DevicesRepository {
  const DevicesRepository({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<void> registerToken(String token, String platform) async {
    try {
      await _dio.post('/devices', data: {'token': token, 'platform': platform});
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }
}