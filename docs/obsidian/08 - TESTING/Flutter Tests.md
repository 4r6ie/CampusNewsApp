# Flutter Tests

## Types

| Type | Location | What to test |
|------|----------|--------------|
| Unit | `test/unit/` | Riverpod providers, API service classes, utility functions |
| Widget | `test/widget/` | Feed card, login form, comment input, profile |
| Integration | `test/integration/` | Login → feed → like → comment flow |

## Running

```bash
cd apps/mobile/flutter_app
flutter test
flutter test integration_test/
```

## Related

- `apps/mobile/flutter_app/test/`
- `08 - TESTING/Test Plan.md`