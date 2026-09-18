# Campus News & Announcement System

Full-stack campus communication platform: **Flutter + Node.js + MySQL + Redis + Docker + Obsidian**.

## Features

- **News feed** — paginated, cached, with like and comment interaction
- **Announcements** — admin-published with priority levels and urgent push notifications
- **Authentication** — JWT access/refresh tokens, bcrypt, role-based access (student/admin)
- **Profiles** — student profile with avatar and contact details
- **Search** — debounced title/content search over posts and announcements
- **Notifications** — Firebase Cloud Messaging device registration and delivery
- **Admin web dashboard** — publish, moderate, and manage content, users, and reports
- **Redis caching** — feed, post, and search caching with TTLs plus rate limiting
- **Audit logging** — admin actions recorded for accountability

## Project Structure

```
campus-news-system/
├── apps/
│   ├── mobile/flutter_app/       # Flutter mobile app
│   └── admin/web_admin/          # Admin web dashboard (React + Vite)
├── services/
│   └── api/node_api/             # Node.js REST API (Express + TypeScript)
│       └── src/                  # config, middleware, modules, routes, services, utils, cache
├── database/
│   ├── migrations/               # 012 SQL migrations (001_users → 012_audit_logs)
│   ├── seeders/                  # TypeScript seed files
│   ├── schema/                   # ERD + relationships documentation
│   └── backups/                  # Automated MySQL dumps (not versioned)
├── infrastructure/
│   ├── docker/                   # API Dockerfile, MySQL + Redis configs
│   ├── nginx/                    # Reverse proxy config
│   └── monitoring/               # Health/backup tooling
├── packages/                     # Shared api-client, shared-types, shared-config
├── tests/                        # integration, e2e, performance, security
├── scripts/                      # setup, migrate, seed, backup, deploy
├── docs/
│   ├── obsidian/                 # Living documentation (Markdown vault, 11 sections)
│   ├── api/                      # API reference exports (OpenAPI / Postman)
│   ├── database/                 # DB export docs and schema snapshots
│   ├── diagrams/                 # Architecture and flow diagrams
│   └── screenshots/              # UI screenshots and mockups
├── .github/workflows/            # CI/CD (flutter, backend, ci, deploy)
├── Makefile
├── LICENSE
├── .env.example
├── docker-compose.yml
└── .gitignore
```

Every directory contains a `README.md` describing its purpose. The canonical documentation lives in the [Obsidian vault](#documentation).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile/UI | Flutter + Dart |
| State management | Riverpod |
| Networking | Dio |
| Routing | go_router |
| Backend | Node.js + TypeScript |
| API | Express with Zod validation |
| Database | MySQL 8 (source of truth) |
| Cache | Redis (ioredis, TTL-based) |
| Push | Firebase Cloud Messaging |
| Admin web | React + Vite (TypeScript) |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Documentation | Obsidian vault in `docs/obsidian/` |

## Prerequisites

- Flutter SDK >= 3.4 (mobile)
- Node.js >= 20 (backend, admin)
- Docker + Docker Compose (infrastructure)
- Android Studio / Xcode for mobile builds

## Quick Start

```bash
# 1. Environment
cp .env.example .env

# 2. Infrastructure: MySQL + Redis (+ optional admin + nginx reverse proxy)
docker compose up -d mysql redis
docker compose up -d nginx   # optional: reverse proxy in front of API and admin web app

# 3. Migrations + seed data
./scripts/migrate.sh
./scripts/seed.sh

# 4. API (http://localhost:3000)
cd services/api/node_api
npm install
npm run dev

# 5. Flutter app
cd apps/mobile/flutter_app
flutter pub get
flutter run

# 6. Admin web (http://localhost:5173)
cd apps/admin/web_admin
npm install
npm run dev
```

When the nginx stack is up, it routes on [`http://localhost:${NGINX_PORT:-8080}`](http://localhost:8080):

| Path | Backend |
|------|---------|
| `/api/v1/` | Node API |
| `/health` | Node API health check |
| `/admin/` | Admin web app (static build) |

### Makefile shortcuts

| Command | Action |
|---------|--------|
| `make infra-up` | Start MySQL + Redis |
| `make migrate` | Apply SQL migrations |
| `make seed` | Insert seed data |
| `make api-dev` | Run API in watch mode |
| `make api-typecheck` | TypeScript check the API |
| `make flutter-test` | Run Flutter tests |
| `make admin-dev` | Run admin web dev server |

## Health Check

```
GET http://localhost:3000/health
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/setup.sh` | Install dependencies and prepare the environment |
| `scripts/migrate.sh` | Apply `database/migrations/*.sql` in order |
| `scripts/seed.sh` | Seed development data |
| `scripts/backup.sh` | Dump MySQL to `database/backups/` |
| `scripts/deploy.sh` | Deploy to staging/production |

## Documentation

Open `docs/obsidian/` as an Obsidian vault and start at **`00 - HOME/Home`**. It covers:

- **01 - PROJECT** objectives, scope, requirements, stakeholders
- **02 - PLANNING** roadmap, use cases, user stories, risks
- **03 - UI UX** screen-by-screen design (`docs/obsidian/03 - UI UX/`)
- **04 - ARCHITECTURE** system, backend, database, Docker, Redis, Flutter
- **05 - DATABASE** ERD and per-table references
- **06 - API** endpoint contracts per module
- **07 - DEVELOPMENT** setup, environment variables, coding standards, git workflow
- **08 - TESTING** test plan, cases, API/Flutter tests, QA checklist
- **09 - BUG TRACKING** tracker, known issues, templates
- **10 - DECISIONS** architectural decision records (ADR-001…005)
- **11 - RELEASES** changelog and deployment notes

## License

[MIT](LICENSE)