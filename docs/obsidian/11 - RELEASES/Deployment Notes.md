# Deployment Notes

## Development

1. `cp .env.example .env`
2. `docker compose up -d mysql redis`
3. `./scripts/migrate.sh` + `./scripts/seed.sh`
4. `npm --prefix services/api/node_api run dev`
5. Flutter on emulator/device

## Staging

- Build API image (infrastructure/docker/api/Dockerfile)
- Provision managed/containerized MySQL + Redis
- Configure staging secrets
- Run migrations + smoke tests
- Deploy Flutter test build

## Production

- Production secrets via secret manager; HTTPS
- Managed database; backups + restore tested
- Monitoring/logging/alerts configured
- Rolling or blue-green deployment
- Verify `/health` + critical flows post-release

## Related

- `04 - ARCHITECTURE/Docker Architecture.md`
- `scripts/deploy.sh`