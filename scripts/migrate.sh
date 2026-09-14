#!/usr/bin/env bash
# Apply database migrations in numeric order.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MYSQL_CONTAINER="${MYSQL_CONTAINER:-campusnewsapp-mysql-1}"

MYSQL_CMD="docker exec -i ${MYSQL_CONTAINER} mysql -u root -pchange_me campus_news"

echo "==> Applying migrations"
for f in "${ROOT_DIR}"/database/migrations/*.sql; do
  echo "    applying $(basename "${f}")"
  ${MYSQL_CMD} < "${f}"
done

echo "Migrations complete."