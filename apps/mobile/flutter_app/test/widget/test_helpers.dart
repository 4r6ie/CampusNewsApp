import 'package:campus_news_app/app/app.dart';
import 'package:campus_news_app/app/router.dart';
import 'package:campus_news_app/features/announcements/providers/announcements_provider.dart';
import 'package:campus_news_app/features/auth/providers/auth_provider.dart';
import 'package:campus_news_app/features/feed/providers/feed_provider.dart';
import 'package:campus_news_app/features/interactions/providers/comments_provider.dart';
import 'package:campus_news_app/features/notifications/providers/notifications_provider.dart';
import 'package:campus_news_app/features/search/providers/search_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import 'fakes.dart';

void setUpTestFonts() {
  GoogleFonts.config.allowRuntimeFetching = false;
}

final List<Override> defaultOverrides = [
  authProvider.overrideWith((ref) => AuthController(FakeAuthRepository())),
  feedRepositoryProvider.overrideWithValue(FakeFeedRepository()),
  announcementsRepositoryProvider.overrideWithValue(FakeAnnouncementsRepository()),
  commentsRepositoryProvider.overrideWithValue(FakeCommentsRepository()),
  searchRepositoryProvider.overrideWithValue(FakeSearchRepository()),
  notificationsRepositoryProvider.overrideWithValue(FakeNotificationsRepository()),
];

class Harness {
  Harness(this.container, this.router);

  final ProviderContainer container;
  final GoRouter router;

  Widget build() {
    return UncontrolledProviderScope(
      container: container,
      child: const CampusNewsApp(),
    );
  }
}

Harness createHarness({List<Override> overrides = const []}) {
  final container = ProviderContainer(overrides: [...defaultOverrides, ...overrides]);
  final router = container.read(appRouterProvider);
  return Harness(container, router);
}

Future<void> pumpApp(
  WidgetTester tester, {
  String initialLocation = '/login',
  List<Override> overrides = const [],
}) async {
  final harness = createHarness(overrides: overrides);
  await tester.pumpWidget(harness.build());
  if (initialLocation != '/login') {
    harness.router.go(initialLocation);
  }
  await tester.pumpAndSettle();
}

Future<void> signIn(WidgetTester tester) async {
  await tester.enterText(
    find.byType(TextFormField).at(0),
    'student@campus.edu',
  );
  await tester.enterText(
    find.byType(TextFormField).at(1),
    'password123',
  );
  await tester.ensureVisible(find.text('Sign In'));
  await tester.tap(find.text('Sign In'));
  await tester.pumpAndSettle();
}

Future<void> tapNavTab(WidgetTester tester, String label) async {
  await tester.tap(find.widgetWithText(NavigationDestination, label));
  await tester.pumpAndSettle();
}

Widget wrapInProvider(Widget child, {List<Override> overrides = const []}) {
  return ProviderScope(
    overrides: overrides,
    child: MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: child,
    ),
  );
}