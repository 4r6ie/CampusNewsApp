import 'package:campus_news_app/features/announcements/screens/announcements_screen.dart';
import 'package:flutter_test/flutter_test.dart';

import 'test_helpers.dart';

void main() {
  setUpAll(setUpTestFonts);

  testWidgets('renders announcements with priority badges', (tester) async {
    await tester.pumpWidget(
      wrapInProvider(const AnnouncementsScreen()),
    );
    await tester.pumpAndSettle();

    expect(find.text('Announcements'), findsOneWidget);
    expect(
      find.text('URGENT: Suspension of Classes on Friday'),
      findsOneWidget,
    );
    expect(find.text('URGENT'), findsOneWidget);
    expect(find.text('IMPORTANT'), findsWidgets);
  });
}