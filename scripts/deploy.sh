#!/usr/bin/env bash
# Build backend images and deploy services for the target environment.
# Usage: ./scripts/deploy.sh <staging|production>
set -euo pipefail

ENV="${1:?Usage: deploy.sh <staging|production>}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Building images for ${ENV}"
docker compose build api

echo "==> Deploying ${ENV}"
docker compose up -d --remove-orphans

echo "==> Smoke test"
sleep 5
curl -fsS http://localhost:3000/health && echo

echo "Deploy complete."