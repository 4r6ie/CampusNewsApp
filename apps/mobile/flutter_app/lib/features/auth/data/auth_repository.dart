import 'package:dio/dio.dart';

import '../../../core/network/api_error.dart';
import '../../../core/storage/token_storage.dart';
import '../models/user.dart';

class AuthResult {
  const AuthResult({required this.user, required this.accessToken, required this.refreshToken});

  final User user;
  final String accessToken;
  final String refreshToken;
}

class AuthRepository {
  AuthRepository({required Dio dio, required TokenStorage storage})
      : _dio = dio,
        _storage = storage;

  final Dio _dio;
  final TokenStorage _storage;

  TokenStorage get storage => _storage;

  Future<AuthResult> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return _toAuthResult(response.data);
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<AuthResult> register({
    required String fullName,
    required String email,
    required String password,
    String? studentNo,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'fullName': fullName,
          'email': email,
          'password': password,
          if (studentNo != null && studentNo.isNotEmpty) 'studentNo': studentNo,
        },
      );
      return _toAuthResult(response.data);
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  /// Refreshes the session using the stored refresh token. Returns null if no
  /// refresh token exists, throws [ApiException] if the refresh is rejected.
  Future<User?> refresh() async {
    final refreshToken = await _storage.readRefreshToken();
    if (refreshToken == null) return null;
    try {
      final response = await _dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      final result = _toAuthResult(response.data);
      return result.user;
    } on DioException catch (error) {
      throw apiExceptionFrom(error);
    }
  }

  Future<void> logout() => _storage.clear();

  AuthResult _toAuthResult(dynamic body) {
    final data = body['data'] as Map<String, dynamic>;
    final user = User.fromJson(data['user'] as Map<String, dynamic>);
    final result = AuthResult(
      user: user,
      accessToken: data['accessToken'] as String,
      refreshToken: data['refreshToken'] as String,
    );
    _persist(result);
    return result;
  }

  Future<void> _persist(AuthResult result) async {
    await _storage.writeAccessToken(result.accessToken);
    await _storage.writeRefreshToken(result.refreshToken);
  }
}