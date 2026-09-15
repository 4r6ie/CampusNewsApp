import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../data/notifications_repository.dart';
import '../models/app_notification.dart';

class NotificationsState {
  const NotificationsState({
    this.items = const [],
    this.loading = false,
    this.error,
  });

  final List<AppNotification> items;
  final bool loading;
  final String? error;

  int get unreadCount => items.where((item) => !item.isRead).length;

  NotificationsState copyWith({
    List<AppNotification>? items,
    bool? loading,
    String? error,
  }) {
    return NotificationsState(
      items: items ?? this.items,
      loading: loading ?? this.loading,
      error: error,
    );
  }
}

class NotificationsController extends StateNotifier<NotificationsState> {
  NotificationsController(this._repository) : super(const NotificationsState());

  final NotificationsRepository _repository;
  bool _loaded = false;

  Future<void> load({bool force = false}) async {
    if (_loaded && !force) return;
    state = state.copyWith(loading: true, error: null);
    try {
      final items = await _repository.fetchNotifications();
      _loaded = true;
      state = state.copyWith(items: items, loading: false);
    } catch (e) {
      state = state.copyWith(loading: false, error: 'Failed to load notifications');
    }
  }

  Future<void> markRead(String id) async {
    final index = _indexOf(id);
    if (index == -1) return;
    final item = state.items[index];
    if (item.isRead) return;

    final updated = _withReadAt(item, DateTime.now());
    final items = [...state.items];
    items[index] = updated;
    state = state.copyWith(items: items);

    try {
      await _repository.markRead(id, read: true);
    } catch (_) {
      // Best-effort; revert the local state on failure.
      final revert = [...state.items];
      revert[index] = item;
      state = state.copyWith(items: revert);
    }
  }

  Future<void> markAllRead() async {
    for (final item in state.items.where((item) => !item.isRead)) {
      await markRead(item.id);
    }
  }

  int _indexOf(String id) => state.items.indexWhere((item) => item.id == id);

  AppNotification _withReadAt(AppNotification item, DateTime at) {
    return AppNotification(
      id: item.id,
      type: item.type,
      title: item.title,
      body: item.body,
      createdAt: item.createdAt,
      readAt: at,
    );
  }
}

final notificationsRepositoryProvider = Provider<NotificationsRepository>((ref) {
  return NotificationsRepository(dio: ref.watch(dioProvider));
});

final notificationsProvider =
    StateNotifierProvider<NotificationsController, NotificationsState>((ref) {
  return NotificationsController(ref.watch(notificationsRepositoryProvider));
});