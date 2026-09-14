import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'test_helpers.dart';

void main() {
  setUpAll(setUpTestFonts);

  testWidgets('profile shows user details after login', (tester) async {
    await pumpApp(tester);
    await signIn(tester);

    await tapNavTab(tester, 'Profile');

    expect(find.text('Juan Dela Cruz'), findsOneWidget);
    expect(find.text('2024-0001'), findsOneWidget);

    await tester.drag(find.byType(ListView), const Offset(0, -400));
    await tester.pumpAndSettle();
    expect(find.text('Log Out'), findsOneWidget);
  });
}