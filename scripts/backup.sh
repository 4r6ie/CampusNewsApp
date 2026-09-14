#!/usr/bin/env bash
# Dump MySQL database to database/backups with a timestamp.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${ROOT_DIR}/database/backups"
STAMP="$(date +%Y%m%d-%H%M%S)"
FILE="${BACKUP_DIR}/campus_news_${STAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "==> Backing up database to ${FILE}"
docker exec campusnewsapp-mysql-1 sh -c \
  'mysqldump -u root -pchange_me --databases campus_news' | gzip > "${FILE}"

echo "Backup complete."