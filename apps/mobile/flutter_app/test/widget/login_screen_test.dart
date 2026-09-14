import 'package:flutter_test/flutter_test.dart';

import 'test_helpers.dart';

void main() {
  setUpAll(setUpTestFonts);

  testWidgets('shows validation errors for empty fields', (tester) async {
    await pumpApp(tester);

    await tester.ensureVisible(find.text('Sign In'));
    await tester.tap(find.text('Sign In'));
    await tester.pumpAndSettle();

    expect(find.text('Email is required'), findsOneWidget);
    expect(find.text('Password is required'), findsOneWidget);
  });

  testWidgets('navigates to the register screen', (tester) async {
    await pumpApp(tester);

    await tester.tap(find.text('Register'));
    await tester.pumpAndSettle();

    expect(find.text('Create your account'), findsOneWidget);
    expect(find.text('Create Account'), findsOneWidget);
  });

  testWidgets('signs in and lands on the home feed', (tester) async {
    await pumpApp(tester);

    await signIn(tester);

    expect(find.text('Campus Feed'), findsOneWidget);
  });
}