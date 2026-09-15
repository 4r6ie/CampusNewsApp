import 'package:campus_news_app/features/feed/providers/feed_provider.dart';
import 'package:campus_news_app/features/feed/screens/feed_screen.dart';
import 'package:campus_news_app/shared/widgets/app_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fakes.dart';
import 'test_helpers.dart';

void main() {
  setUpAll(setUpTestFonts);

  Future<void> pumpFeed(WidgetTester tester) async {
    await tester.pumpWidget(
      wrapInProvider(
        const FeedScreen(),
        overrides: [
          feedRepositoryProvider.overrideWithValue(FakeFeedRepository()),
        ],
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('renders posts after loading', (tester) async {
    await pumpFeed(tester);

    expect(find.text('Campus Feed'), findsOneWidget);
    expect(
      find.text('Intramurals 2026: Registration Now Open'),
      findsOneWidget,
    );
    expect(find.byType(AppCard), findsWidgets);
  });

  testWidgets('filters posts by category', (tester) async {
    await pumpFeed(tester);

    await tester.tap(find.widgetWithText(ChoiceChip, 'News'));
    await tester.pumpAndSettle();

    expect(find.text('Campus Shuttle Schedule Updated'), findsOneWidget);
    expect(
      find.text('Intramurals 2026: Registration Now Open'),
      findsNothing,
    );
  });
}