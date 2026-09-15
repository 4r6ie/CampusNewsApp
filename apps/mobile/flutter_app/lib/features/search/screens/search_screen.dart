import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/empty_state.dart';
import '../models/search_result.dart';
import '../providers/search_provider.dart';

class SearchScreen extends ConsumerWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final search = ref.watch(searchProvider);
    final query = search.query;

    return Scaffold(
      appBar: AppBar(title: const Text('Search')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              autofocus: true,
              textInputAction: TextInputAction.search,
              onChanged: (value) =>
                  ref.read(searchProvider.notifier).onQueryChanged(value),
              decoration: InputDecoration(
                hintText: 'Search news, announcements, categories',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: query.isEmpty
                    ? null
                    : IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () {
                          ref.read(searchProvider.notifier).onQueryChanged('');
                        },
                      ),
              ),
            ),
          ),
          Expanded(
            child: _buildBody(search),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(SearchState search) {
    if (!search.hasSearched) {
      return const EmptyState(
        icon: Icons.search,
        message: 'Type to search across news, announcements, and categories',
      );
    }

    if (search.loading && search.results.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (search.results.isEmpty) {
      return EmptyState(
        icon: Icons.search_off,
        message: search.error ?? 'No results for "${search.query}"',
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: search.results.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) =>
          _SearchResultTile(result: search.results[index]),
    );
  }
}

class _SearchResultTile extends StatelessWidget {
  const _SearchResultTile({required this.result});

  final SearchResult result;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isAnnouncement = result.type == SearchResultType.announcement;

    return ListTile(
      leading: Icon(
        isAnnouncement ? Icons.campaign_outlined : Icons.article_outlined,
        color: isAnnouncement ? colorScheme.tertiary : colorScheme.primary,
      ),
      title: Text(
        result.title,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: theme.textTheme.titleSmall,
      ),
      subtitle: Text(
        result.body,
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
        style: theme.textTheme.bodySmall?.copyWith(
          color: colorScheme.onSurfaceVariant,
        ),
      ),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          '${result.typeLabel} · ${result.meta}',
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
          ),
        ),
      ),
    );
  }
}