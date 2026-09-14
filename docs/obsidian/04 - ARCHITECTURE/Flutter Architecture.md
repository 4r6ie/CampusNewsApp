# Flutter Architecture

## State Management
Riverpod providers for dependency injection and predictable state.

## Navigation
go_router with guarded routes (redirect on missing auth token).

## API Layer
Dio HTTP client with auth interceptor that attaches Bearer token from Flutter Secure Storage. Handles connection errors and token refresh.

## Feature Structure

```
lib/
├── app/         — router, theme, config
├── core/        — constants, network, storage, utils, widgets
├── features/    — auth, feed, announcements, comments, likes, profile, search, notifications, settings
└── shared/      — models, widgets, components
```

Each feature contains `data/`, `models/`, `providers/`, `screens/`, `widgets/`.

## See Also

- `apps/mobile/flutter_app/lib/`
- `03 - UI UX/Design System.md`