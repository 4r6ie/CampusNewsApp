# Changelog

## [Unreleased]

### Added
- Full monorepo structure (monorepo, apps, services, packages, infrastructure, database, tests, docs)
- **Phase 1 — UI/UX Foundation (mock data only, no backend):**
  - Shared component library: `AppButton`, `AppTextField`, `EmptyState`, `SkeletonLoader` (`apps/mobile/flutter_app/lib/shared/widgets/`)
  - Mock auth: login + register screens with form validation (`features/auth/*`)
  - Home shell with working bottom navigation across 5 tabs (`lib/app/shell/home_shell.dart`, `lib/app/router.dart`)
  - Feed/Home screen with category filter chips, post cards, pull-to-refresh, skeleton loading (`features/feed/*`)
  - Announcements screen with priority badges and pinned sorting (`features/announcements/*`)
  - Search screen with live client-side filtering (`features/search/*`)
  - Notifications screen with unread state + mark-all-read (`features/notifications/*`)
  - Profile screen with stats and logout (`features/profile/*`)
  - Widget tests covering navigation, login, register, feed, announcements, search, notifications, profile (`apps/mobile/flutter_app/test/widget/*`)

### Planned
- Phase 2: Backend (already implemented) verification under Docker
- JWT authentication module verified end-to-end
- Feed pagination with Redis caching
- Announcement publishing with urgent notification trigger
- Push device registration (FCM)
- Search with debounce and caching
- Admin dashboard (web)

### Fixed
- BUG-001: Null image URL causes feed crash

## [1.0.0] - 2026-09-14

### Added
- Project documentation
- Initial repository structure
- Tech stack ADRs (001–005)

## Related

- `11 - RELEASES/Deployment Notes.md`
- `11 - RELEASES/Version 1.0.md`