import 'package:campus_news_app/features/feed/screens/feed_screen.dart';
import 'package:campus_news_app/shared/widgets/skeleton_loader.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'test_helpers.dart';

void main() {
  setUpAll(setUpTestFonts);

  Future<void> pumpFeed(WidgetTester tester) async {
    await tester.pumpWidget(wrapInProvider(const FeedScreen()));
    await tester.pumpAndSettle();
  }

  testWidgets('renders mock posts after loading', (tester) async {
    await pumpFeed(tester);

    expect(find.text('Campus Feed'), findsOneWidget);
    expect(
      find.text('Intramurals 2026: Registration Now Open'),
      findsOneWidget,
    );
    expect(find.byType(Card), findsWidgets);
  });

  testWidgets('renders the loading skeleton on initial load', (tester) async {
    await tester.pumpWidget(wrapInProvider(const FeedScreen()));

    expect(find.byType(SkeletonLoader), findsWidgets);
    expect(find.text('Campus Feed'), findsOneWidget);

    await tester.pump(const Duration(milliseconds: 500));
    await tester.pumpAndSettle();
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