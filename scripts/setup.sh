#!/usr/bin/env bash
# One-time development environment setup.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Copying environment template"
if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "==> Starting infrastructure (MySQL + Redis)"
docker compose up -d mysql redis
docker compose ps

echo "==> Installing API dependencies"
npm --prefix services/api/node_api install

echo "==> Installing admin web dependencies"
npm --prefix apps/admin/web_admin install

echo "==> Flutter app"
echo "    cd apps/mobile/flutter_app && flutter pub get"

echo "Setup complete. See docs/obsidian/07 - DEVELOPMENT/Installation.md"