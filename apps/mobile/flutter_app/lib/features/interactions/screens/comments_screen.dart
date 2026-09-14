import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/utils/relative_time.dart';
import '../../../shared/widgets/app_card.dart';
import '../data/comments_repository.dart';
import '../providers/comments_provider.dart';

class CommentsScreen extends ConsumerStatefulWidget {
  const CommentsScreen({super.key, required this.postId, required this.postTitle});

  final String postId;
  final String postTitle;

  @override
  ConsumerState<CommentsScreen> createState() => _CommentsScreenState();
}

class _CommentsScreenState extends ConsumerState<CommentsScreen> {
  late final TextEditingController _controller;
  late final CommentsController _commentsController;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _commentsController = ref.read(commentsProvider(widget.postId).notifier);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() => _submitting = true);
    try {
      await _commentsController.addComment(text);
      _controller.clear();
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to post comment')),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  bool _submitting = false;

  @override
  Widget build(BuildContext context) {
    final comments = ref.watch(commentsProvider(widget.postId));

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.postTitle),
        centerTitle: false,
      ),
      body: Column(
        children: [
          Expanded(
            child: comments.loading && comments.comments.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : comments.comments.isEmpty
                    ? const Center(
                        child: Text('No comments yet. Be the first to comment!'),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: comments.comments.length,
                        itemBuilder: (context, index) {
                          final comment = comments.comments[index];
                          return _CommentTile(comment: comment);
                        },
                      ),
          ),
          const Divider(height: 1),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: const InputDecoration(
                        hintText: 'Write a comment...',
                        border: InputBorder.none,
                      ),
                      maxLines: null,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send, size: 20),
                    onPressed: _submitting ? null : _submit,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CommentTile extends StatelessWidget {
  const _CommentTile({required this.comment});

  final Comment comment;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: theme.colorScheme.secondary,
                child: Text(
                  comment.authorName.isEmpty
                      ? '?'
                      : comment.authorName[0].toUpperCase(),
                  style: TextStyle(
                    color: theme.colorScheme.onSecondary,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  comment.authorName,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Text(
                formatRelativeTime(comment.createdAt),
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(comment.content),
        ],
      ),
    );
  }
}