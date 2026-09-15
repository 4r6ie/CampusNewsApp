import 'package:campus_news_app/features/notifications/providers/notifications_provider.dart';
import 'package:campus_news_app/features/notifications/screens/notifications_screen.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fakes.dart';
import 'test_helpers.dart';

void main() {
  setUpAll(setUpTestFonts);

  testWidgets('renders notifications and marks all as read', (tester) async {
    await tester.pumpWidget(
      wrapInProvider(
        const NotificationsScreen(),
        overrides: [
          notificationsRepositoryProvider
              .overrideWithValue(FakeNotificationsRepository()),
        ],
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Notifications'), findsOneWidget);
    expect(find.text('Mark all read'), findsOneWidget);
    expect(find.textContaining('unread'), findsOneWidget);

    await tester.tap(find.text('Mark all read'));
    await tester.pumpAndSettle();

    expect(find.text('Mark all read'), findsNothing);
    expect(find.textContaining('unread'), findsNothing);
  });
}