import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../data/announcements_repository.dart';
import '../models/announcement.dart';

class AnnouncementsState {
  const AnnouncementsState({
    this.announcements = const [],
    this.loading = false,
    this.error,
  });

  final List<Announcement> announcements;
  final bool loading;
  final String? error;

  AnnouncementsState copyWith({
    List<Announcement>? announcements,
    bool? loading,
    String? error,
  }) {
    return AnnouncementsState(
      announcements: announcements ?? this.announcements,
      loading: loading ?? this.loading,
      error: error,
    );
  }
}

class AnnouncementsController extends StateNotifier<AnnouncementsState> {
  AnnouncementsController(this._repository) : super(const AnnouncementsState()) {
    load();
  }

  final AnnouncementsRepository _repository;

  Future<void> load() async {
    state = state.copyWith(loading: true, error: null);
    try {
      final announcements = await _repository.list();
      if (!mounted) return;
      state = state.copyWith(
        announcements: announcements,
        loading: false,
      );
    } catch (e) {
      if (!mounted) return;
      state = state.copyWith(loading: false, error: 'Failed to load announcements');
    }
  }
}

final announcementsRepositoryProvider = Provider<AnnouncementsRepository>((ref) {
  return AnnouncementsRepository(dio: ref.watch(dioProvider));
});

final announcementsProvider =
    StateNotifierProvider<AnnouncementsController, AnnouncementsState>((ref) {
  return AnnouncementsController(ref.watch(announcementsRepositoryProvider));
});