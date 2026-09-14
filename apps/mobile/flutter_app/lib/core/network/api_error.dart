import 'package:dio/dio.dart';

import '../utils/app_exceptions.dart';

/// Maps a caught error (usually a [DioException]) into an [ApiException]
/// using the API's `{ error: { code, message } }` envelope when available.
ApiException apiExceptionFrom(Object error) {
  if (error is ApiException) return error;
  if (error is DioException) {
    final data = error.response?.data;
    if (data is Map && data['error'] is Map) {
      final errorBody = data['error'] as Map;
      return ApiException(
        code: (errorBody['code'] ?? 'API_ERROR').toString(),
        message: (errorBody['message'] ?? 'Something went wrong').toString(),
        statusCode: error.response?.statusCode,
      );
    }
    return ApiException(
      code: 'HTTP_${error.response?.statusCode ?? 'ERROR'}',
      message: error.message ?? 'Request failed',
      statusCode: error.response?.statusCode,
    );
  }
  if (error is NetworkException) {
    return ApiException(code: 'NETWORK_ERROR', message: error.message);
  }
  return ApiException(code: 'UNKNOWN_ERROR', message: error.toString());
}