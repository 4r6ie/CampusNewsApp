import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../../../core/storage/token_storage.dart';
import '../data/auth_repository.dart';
import '../models/user.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthState {
  const AuthState({this.user, this.status = AuthStatus.unknown});

  final User? user;
  final AuthStatus status;

  bool get isAuthenticated => status == AuthStatus.authenticated;

  AuthState copyWith({User? user, AuthStatus? status}) {
    return AuthState(
      user: user ?? this.user,
      status: status ?? this.status,
    );
  }
}

class AuthController extends StateNotifier<AuthState> {
  AuthController(this._repository)
      : super(const AuthState(status: AuthStatus.unknown)) {
    _restoreSession();
  }

  final AuthRepository _repository;

  Future<void> login({
    required String email,
    required String password,
  }) async {
    final result = await _repository.login(email: email, password: password);
    state = AuthState(user: result.user, status: AuthStatus.authenticated);
  }

  Future<void> register({
    required String fullName,
    required String email,
    required String password,
    String? studentNo,
  }) async {
    final result = await _repository.register(
      fullName: fullName,
      email: email,
      password: password,
      studentNo: studentNo,
    );
    state = AuthState(user: result.user, status: AuthStatus.authenticated);
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AuthState(user: null, status: AuthStatus.unauthenticated);
  }

  Future<void> _restoreSession() async {
    try {
      final user = await _repository.refresh();
      if (!mounted) return;
      state = AuthState(
        user: user,
        status: user == null
            ? AuthStatus.unauthenticated
            : AuthStatus.authenticated,
      );
    } catch (_) {
      await _repository.logout();
      if (!mounted) return;
      state = const AuthState(user: null, status: AuthStatus.unauthenticated);
    }
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    dio: ref.watch(dioProvider),
    storage: ref.watch(tokenStorageProvider),
  );
});

final authProvider =
    StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref.watch(authRepositoryProvider));
});