import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../data/search_repository.dart';
import '../models/search_result.dart';

class SearchState {
  const SearchState({
    this.query = '',
    this.loading = false,
    this.results = const [],
    this.error,
  });

  final String query;
  final bool loading;
  final List<SearchResult> results;
  final String? error;

  bool get hasSearched => query.isNotEmpty;

  SearchState copyWith({
    String? query,
    bool? loading,
    List<SearchResult>? results,
    String? error,
  }) {
    return SearchState(
      query: query ?? this.query,
      loading: loading ?? this.loading,
      results: results ?? this.results,
      error: error,
    );
  }
}

class SearchController extends StateNotifier<SearchState> {
  SearchController(this._repository) : super(const SearchState());

  final SearchRepository _repository;
  Timer? _debounce;

  void onQueryChanged(String value) {
    final query = value.trim();
    _debounce?.cancel();
    if (query.isEmpty) {
      state = state.copyWith(query: '', results: const [], error: null);
      return;
    }
    state = state.copyWith(query: query, loading: true, error: null);
    _debounce = Timer(const Duration(milliseconds: 350), () {
      _search(query);
    });
  }

  Future<void> _search(String query) async {
    try {
      final result = await _repository.search(query);
      if (!mounted) return;
      if (state.query != query) return;
      state = state.copyWith(results: result.results, loading: false);
    } catch (e) {
      if (!mounted) return;
      if (state.query != query) return;
      state = state.copyWith(loading: false, error: 'Search failed');
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }
}

final searchRepositoryProvider = Provider<SearchRepository>((ref) {
  return SearchRepository(dio: ref.watch(dioProvider));
});

final searchProvider =
    StateNotifierProvider<SearchController, SearchState>((ref) {
  return SearchController(ref.watch(searchRepositoryProvider));
});