# Campus News & Announcement System

Full-stack campus communication platform: **Flutter + Node.js + MySQL + Redis + Docker + Obsidian**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile/UI | Flutter + Dart |
| State | Riverpod |
| Networking | Dio |
| Routing | go_router |
| Backend | Node.js + TypeScript |
| API | Express with Zod validation |
| Database | MySQL 8 |
| Cache | Redis (ioredis) |
| Push | Firebase Cloud Messaging |
| Admin web | React + Vite |
| Containers | Docker + Compose |
| Docs | Obsidian vault in `docs/obsidian/` |

## Project Structure

```
campus-news-system/
├── apps/
│   ├── mobile/flutter_app/       # Flutter mobile app
│   └── admin/web_admin/          # Admin web dashboard
├── services/
│   └── api/node_api/             # Node.js REST API
├── database/
│   ├── migrations/               # 012 SQL migrations (users → audit_logs)
│   ├── seeders/                  # Seed data
│   └── schema/                   # ERD + relationships docs
├── infrastructure/
│   ├── docker/                   # api Dockerfile, mysql/redis config
│   ├── nginx/                    # reverse proxy
│   └── monitoring/               # health/backup tooling
├── packages/                     # shared api-client, types, config
├── tests/                        # integration, e2e, performance, security
├── scripts/                      # setup, migrate, seed, backup, deploy
├── docs/
│   ├── obsidian/                 # Living documentation (vault)
│   ├── api/                      # API export/docs
│   ├── database/                 # DB export/docs
│   ├── diagrams/
│   └── screenshots/
├── .github/workflows/            # CI/CD
├── Makefile
├── LICENSE
├── .env.example
├── docker-compose.yml
└── .gitignore
```

## Quick Start

```bash
cp .env.example .env
docker compose up -d mysql redis

# migrations + seed
./scripts/migrate.sh
./scripts/seed.sh

# API (http://localhost:3000)
cd services/api/node_api
npm install
npm run dev

# Flutter app
cd apps/mobile/flutter_app
flutter pub get
flutter run

# Admin web (http://localhost:5173)
cd apps/admin/web_admin
npm install
npm run dev
```

Makefile shortcuts: `make infra-up`, `make migrate`, `make seed`, `make api-dev`.

## Documentation

Open `docs/obsidian/` as an Obsidian vault. Start at `00 - HOME/Home`.

## License

[MIT](LICENSE)