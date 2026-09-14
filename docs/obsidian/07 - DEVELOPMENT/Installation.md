# Installation

## Prerequisites

- Flutter SDK >= 3.4
- Docker + Docker Compose
- Node.js >= 20
- Android Studio / Xcode (mobile)
- Obsidian (documentation vault)

## Quick Start

```bash
git clone <repo-url>
cd campus-news-system
cp .env.example .env
./scripts/setup.sh
```

## Steps

1. **Infrastructure** — `docker compose up -d mysql redis`
2. **Migrations** — `./scripts/migrate.sh`
3. **Seed** — `./scripts/seed.sh`
4. **API** — `cd services/api/node_api && npm run dev`
5. **Flutter** — `cd apps/mobile/flutter_app && flutter pub get && flutter run`
6. **Admin** — `cd apps/admin/web_admin && npm run dev`

## See Also

- `07 - DEVELOPMENT/Docker Setup.md`
- `07 - DEVELOPMENT/Environment Variables.md`