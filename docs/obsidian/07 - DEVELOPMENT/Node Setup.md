# Node Setup

## Install

```bash
nvm install 20
nvm use 20
```

## API Setup

```bash
cd services/api/node_api
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # verify TypeScript
```

## Health Check

```bash
curl http://localhost:3000/health
# {"success":true,"data":{"status":"ok","timestamp":"..."}}
```

## Related

- `services/api/node_api/`
- `04 - ARCHITECTURE/Backend Architecture.md`