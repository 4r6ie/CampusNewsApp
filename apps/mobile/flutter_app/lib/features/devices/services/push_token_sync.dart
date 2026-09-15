import 'package:dio/dio.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../data/devices_repository.dart';

class PushTokenSync {
  const PushTokenSync({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Future<void> sync() async {
    try {
      final token = await FirebaseMessaging.instance.getToken();
      if (token == null) return;

      String platform;
      if (kIsWeb) {
        platform = 'web';
      } else {
        platform = switch (defaultTargetPlatform) {
          TargetPlatform.iOS => 'ios',
          TargetPlatform.macOS => 'ios',
          _ => 'android',
        };
      }

      await DevicesRepository(dio: _dio)
          .registerToken(token, platform);
    } catch (_) {
      // Firebase is not configured (no google-services.json / plist yet).
      // Swallow so authentication is never blocked by push setup.
    }
  }
}