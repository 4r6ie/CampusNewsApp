import 'package:campus_news_app/features/search/providers/search_provider.dart';
import 'package:campus_news_app/features/search/screens/search_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fakes.dart';
import 'test_helpers.dart';

void main() {
  setUpAll(setUpTestFonts);

  Future<void> pumpSearch(WidgetTester tester) async {
    await tester.pumpWidget(
      wrapInProvider(
        const SearchScreen(),
        overrides: [
          searchRepositoryProvider.overrideWithValue(FakeSearchRepository()),
        ],
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('shows prompt when query is empty', (tester) async {
    await pumpSearch(tester);

    expect(find.textContaining('Type to search'), findsOneWidget);
  });

  testWidgets('returns matching results', (tester) async {
    await pumpSearch(tester);

    await tester.enterText(
      find.byType(TextField),
      'intramurals',
    );
    await tester.pumpAndSettle();

    expect(
      find.text('Intramurals 2026: Registration Now Open'),
      findsOneWidget,
    );
  });

  testWidgets('shows empty state for no matches', (tester) async {
    await pumpSearch(tester);

    await tester.enterText(find.byType(TextField), 'zzzzz');
    await tester.pumpAndSettle();

    expect(find.textContaining('No results for'), findsOneWidget);
  });
}