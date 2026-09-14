import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'test_helpers.dart';

Future<void> openProfileTab(WidgetTester tester) async {
  await tapNavTab(tester, 'Profile');
  await tester.drag(find.byType(ListView), const Offset(0, -400));
  await tester.pumpAndSettle();
}

void main() {
  setUpAll(setUpTestFonts);

  testWidgets('starts on the login screen and signs in to the feed',
      (tester) async {
    await pumpApp(tester);
    expect(find.text('Sign In'), findsOneWidget);

    await signIn(tester);

    expect(find.text('Campus Feed'), findsOneWidget);
    expect(find.byType(NavigationDestination), findsNWidgets(5));
  });

  testWidgets('bottom navigation switches between all tabs', (tester) async {
    await pumpApp(tester);
    await signIn(tester);

    await tapNavTab(tester, 'Announcements');
    expect(find.text('Announcements'), findsWidgets);

    await tapNavTab(tester, 'Search');
    expect(find.text('Search'), findsWidgets);

    await tapNavTab(tester, 'Alerts');
    expect(find.text('Notifications'), findsOneWidget);

    await tapNavTab(tester, 'Profile');
    expect(find.text('Juan Dela Cruz'), findsOneWidget);

    await openProfileTab(tester);
    expect(find.text('Log Out'), findsOneWidget);

    await tapNavTab(tester, 'Home');
    expect(find.text('Campus Feed'), findsOneWidget);
  });

  testWidgets('logout returns to the login screen', (tester) async {
    await pumpApp(tester);
    await signIn(tester);

    await openProfileTab(tester);
    await tester.tap(find.text('Log Out'));
    await tester.pumpAndSettle();

    expect(find.text('Sign In'), findsOneWidget);
  });
}