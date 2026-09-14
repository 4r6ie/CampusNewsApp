import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../constants/app_constants.dart';

final tokenStorageProvider = Provider<TokenStorage>((ref) {
  return TokenStorage();
});

class TokenStorage {
  static const _storage = FlutterSecureStorage();

  Future<String?> readAccessToken() async {
    return _storage.read(key: CacheKeys.authToken);
  }

  Future<void> writeAccessToken(String token) async {
    await _storage.write(key: CacheKeys.authToken, value: token);
  }

  Future<String?> readRefreshToken() async {
    return _storage.read(key: CacheKeys.refreshToken);
  }

  Future<void> writeRefreshToken(String token) async {
    await _storage.write(key: CacheKeys.refreshToken, value: token);
  }

  Future<void> clear() async {
    await _storage.deleteAll();
  }
}