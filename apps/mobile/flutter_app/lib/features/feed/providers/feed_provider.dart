import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../../interactions/data/likes_repository.dart';
import '../data/feed_repository.dart';
import '../models/post.dart';

enum FeedFilter { all, news, events, academic, general }

class FeedState {
  const FeedState({
    this.posts = const [],
    this.loading = false,
    this.loadingMore = false,
    this.hasMore = true,
    this.error,
    this.filter = FeedFilter.all,
  });

  final List<Post> posts;
  final bool loading;
  final bool loadingMore;
  final bool hasMore;
  final String? error;
  final FeedFilter filter;

  FeedState copyWith({
    List<Post>? posts,
    bool? loading,
    bool? loadingMore,
    bool? hasMore,
    String? error,
    FeedFilter? filter,
  }) {
    return FeedState(
      posts: posts ?? this.posts,
      loading: loading ?? this.loading,
      loadingMore: loadingMore ?? this.loadingMore,
      hasMore: hasMore ?? this.hasMore,
      error: error,
      filter: filter ?? this.filter,
    );
  }
}

String? _categoryForFilter(FeedFilter filter) {
  return switch (filter) {
    FeedFilter.all => null,
    FeedFilter.news => 'news',
    FeedFilter.events => 'event',
    FeedFilter.academic => 'academic',
    FeedFilter.general => 'general',
  };
}

class FeedController extends StateNotifier<FeedState> {
  FeedController(this._feedRepository, this._likesRepository)
      : super(const FeedState()) {
    load();
  }

  final FeedRepository _feedRepository;
  final LikesRepository _likesRepository;
  int _page = 1;

  Future<void> load() async {
    state = state.copyWith(loading: true, error: null);
    _page = 1;
    try {
      final category = _categoryForFilter(state.filter);
      final result = await _feedRepository.getFeed(category: category, page: 1);
      if (!mounted) return;
      state = state.copyWith(
        posts: result.posts,
        loading: false,
        hasMore: result.hasMore,
      );
    } catch (e) {
      if (!mounted) return;
      state = state.copyWith(loading: false, error: 'Failed to load feed');
    }
  }

  Future<void> loadMore() async {
    if (state.loadingMore || !state.hasMore) return;
    state = state.copyWith(loadingMore: true);
    _page++;
    try {
      final category = _categoryForFilter(state.filter);
      final result = await _feedRepository.getFeed(category: category, page: _page);
      if (!mounted) return;
      state = state.copyWith(
        posts: [...state.posts, ...result.posts],
        loadingMore: false,
        hasMore: result.hasMore,
      );
    } catch (e) {
      if (!mounted) return;
      _page--;
      state = state.copyWith(loadingMore: false);
    }
  }

  Future<void> setFilter(FeedFilter filter) async {
    if (filter == state.filter) return;
    state = state.copyWith(filter: filter);
    await load();
  }

  Future<void> toggleLike(String postId) async {
    final index = state.posts.indexWhere((p) => p.id == postId);
    if (index == -1) return;

    final post = state.posts[index];
    final wasLiked = post.likedByMe;
    final optimisticCount = wasLiked ? post.likeCount - 1 : post.likeCount + 1;

    final updatedPosts = List<Post>.from(state.posts);
    updatedPosts[index] = post.copyWith(
      likedByMe: !wasLiked,
      likeCount: optimisticCount,
    );
    state = state.copyWith(posts: updatedPosts);

    try {
      final result = wasLiked
          ? await _likesRepository.unlike(postId)
          : await _likesRepository.like(postId);
      final finalPosts = List<Post>.from(state.posts);
      final finalIndex = finalPosts.indexWhere((p) => p.id == postId);
      if (finalIndex != -1) {
        finalPosts[finalIndex] = finalPosts[finalIndex].copyWith(
          likedByMe: result.liked,
          likeCount: result.likeCount,
        );
        state = state.copyWith(posts: finalPosts);
      }
    } catch (e) {
      final revertedPosts = List<Post>.from(state.posts);
      final revertedIndex = revertedPosts.indexWhere((p) => p.id == postId);
      if (revertedIndex != -1) {
        revertedPosts[revertedIndex] = post;
        state = state.copyWith(posts: revertedPosts);
      }
    }
  }
}

final feedRepositoryProvider = Provider<FeedRepository>((ref) {
  return FeedRepository(dio: ref.watch(dioProvider));
});

final likesRepositoryProvider = Provider<LikesRepository>((ref) {
  return LikesRepository(dio: ref.watch(dioProvider));
});

final feedProvider = StateNotifierProvider<FeedController, FeedState>((ref) {
  return FeedController(
    ref.watch(feedRepositoryProvider),
    ref.watch(likesRepositoryProvider),
  );
});