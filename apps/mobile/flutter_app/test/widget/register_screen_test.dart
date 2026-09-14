import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'test_helpers.dart';

Future<void> goToRegister(WidgetTester tester) async {
  await pumpApp(tester);
  await tester.tap(find.text('Register'));
  await tester.pumpAndSettle();
}

Future<void> fillRegistrationForm(WidgetTester tester, {bool matching = true}) async {
  final fields = find.byType(TextFormField);
  await tester.enterText(fields.at(0), 'Juan');
  await tester.enterText(fields.at(1), 'Dela Cruz');
  await tester.enterText(fields.at(2), 'student@campus.edu');
  await tester.enterText(fields.at(3), '2024-0001');
  await tester.enterText(fields.at(4), 'password123');
  await tester.enterText(
    fields.at(5),
    matching ? 'password123' : 'different',
  );
}

void main() {
  setUpAll(setUpTestFonts);

  testWidgets('validates password mismatch', (tester) async {
    await goToRegister(tester);
    await fillRegistrationForm(tester, matching: false);
    await tester.ensureVisible(find.text('Create Account'));
    await tester.tap(find.text('Create Account'));
    await tester.pumpAndSettle();

    expect(find.text('Passwords do not match'), findsOneWidget);
  });

  testWidgets('registers and lands on the home feed', (tester) async {
    await goToRegister(tester);
    await fillRegistrationForm(tester);
    await tester.ensureVisible(find.text('Create Account'));
    await tester.tap(find.text('Create Account'));
    await tester.pumpAndSettle();

    expect(find.text('Campus Feed'), findsOneWidget);
  });
}