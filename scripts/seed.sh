#!/usr/bin/env bash
# Seed the database with development data.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Seeding via Node seeder"
npm --prefix services/api/node_api run db:seed

echo "Seed complete."