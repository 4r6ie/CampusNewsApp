import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/app_config.dart';
import '../utils/app_exceptions.dart';
import '../storage/token_storage.dart';

/// Lazily exchanges a stored refresh token for a fresh token pair.
/// Uses an interceptor-free Dio to avoid recursion.
Future<String?> refreshAccessToken(TokenStorage storage) async {
  final refreshToken = await storage.readRefreshToken();
  if (refreshToken == null) return null;

  final dio = Dio(
    BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      contentType: 'application/json',
    ),
  );

  final response = await dio.post(
    '/auth/refresh',
    data: {'refreshToken': refreshToken},
  );

  final data = response.data['data'] as Map<String, dynamic>;
  final accessToken = data['accessToken'] as String;
  final newRefreshToken = data['refreshToken'] as String;

  await storage.writeAccessToken(accessToken);
  await storage.writeRefreshToken(newRefreshToken);
  return accessToken;
}

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      contentType: 'application/json',
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await ref.read(tokenStorageProvider).readAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.type == DioExceptionType.connectionTimeout ||
            error.type == DioExceptionType.receiveTimeout ||
            error.type == DioExceptionType.connectionError) {
          handler.next(
            DioException(
              requestOptions: error.requestOptions,
              error: NetworkException('No internet connection'),
            ),
          );
          return;
        }

        final path = error.requestOptions.path;
        final isAuthRequest =
            path.contains('/auth/login') ||
            path.contains('/auth/register') ||
            path.contains('/auth/refresh') ||
            path.contains('/auth/logout');

        final alreadyRetried = error.requestOptions.extra['retried'] == true;

        if (error.response?.statusCode == 401 &&
            !isAuthRequest &&
            !alreadyRetried) {
          try {
            final storage = ref.read(tokenStorageProvider);
            final newToken = await refreshAccessToken(storage);
            if (newToken != null) {
              error.requestOptions.headers['Authorization'] =
                  'Bearer $newToken';
              error.requestOptions.extra['retried'] = true;
              final retry = await dio.fetch(error.requestOptions);
              return handler.resolve(retry);
            }
          } catch (_) {
            // Refresh failed; fall through to the original 401.
          }
        }

        handler.next(error);
      },
    ),
  );

  return dio;
});