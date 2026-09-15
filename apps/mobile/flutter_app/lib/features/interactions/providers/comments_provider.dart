import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../data/comments_repository.dart';

class CommentsState {
  const CommentsState({
    this.comments = const [],
    this.loading = false,
    this.loadingMore = false,
    this.hasMore = true,
    this.error,
  });

  final List<Comment> comments;
  final bool loading;
  final bool loadingMore;
  final bool hasMore;
  final String? error;

  CommentsState copyWith({
    List<Comment>? comments,
    bool? loading,
    bool? loadingMore,
    bool? hasMore,
    String? error,
  }) {
    return CommentsState(
      comments: comments ?? this.comments,
      loading: loading ?? this.loading,
      loadingMore: loadingMore ?? this.loadingMore,
      hasMore: hasMore ?? this.hasMore,
      error: error,
    );
  }
}

class CommentsController extends StateNotifier<CommentsState> {
  CommentsController(this._repository, this._postId)
      : super(const CommentsState()) {
    load();
  }

  final CommentsRepository _repository;
  final String _postId;
  int _page = 1;

  Future<void> load() async {
    state = state.copyWith(loading: true, error: null);
    _page = 1;
    try {
      final result = await _repository.getComments(_postId, page: 1);
      if (!mounted) return;
      state = state.copyWith(
        comments: result.comments,
        loading: false,
        hasMore: result.hasMore,
      );
    } catch (e) {
      if (!mounted) return;
      state = state.copyWith(loading: false, error: 'Failed to load comments');
    }
  }

  Future<void> loadMore() async {
    if (state.loadingMore || !state.hasMore) return;
    state = state.copyWith(loadingMore: true);
    _page++;
    try {
      final result = await _repository.getComments(_postId, page: _page);
      if (!mounted) return;
      state = state.copyWith(
        comments: [...state.comments, ...result.comments],
        loadingMore: false,
        hasMore: result.hasMore,
      );
    } catch (e) {
      if (!mounted) return;
      state = state.copyWith(loadingMore: false);
      _page--;
    }
  }

  Future<void> addComment(String content) async {
    try {
      final comment = await _repository.addComment(_postId, content: content);
      if (!mounted) return;
      state = state.copyWith(comments: [...state.comments, comment]);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> updateComment(String commentId, String content) async {
    await _repository.updateComment(commentId, content: content);
    if (!mounted) return;
    final index = state.comments.indexWhere((c) => c.id == commentId);
    if (index == -1) return;
    final comments = List<Comment>.from(state.comments);
    comments[index] = Comment(
      id: comments[index].id,
      postId: comments[index].postId,
      authorId: comments[index].authorId,
      authorName: comments[index].authorName,
      content: content,
      createdAt: comments[index].createdAt,
    );
    state = state.copyWith(comments: comments);
  }

  Future<void> deleteComment(String commentId) async {
    await _repository.deleteComment(commentId);
    if (!mounted) return;
    state = state.copyWith(
      comments: state.comments.where((c) => c.id != commentId).toList(),
    );
  }
}

final commentsRepositoryProvider = Provider<CommentsRepository>((ref) {
  return CommentsRepository(dio: ref.watch(dioProvider));
});

final commentsProvider =
    StateNotifierProvider.family<CommentsController, CommentsState, String>(
  (ref, postId) => CommentsController(
    ref.watch(commentsRepositoryProvider),
    postId,
  ),
);