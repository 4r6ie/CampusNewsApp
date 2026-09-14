# ADR-002 — Architecture

**Status:** Accepted  
**Date:** September 14, 2026

## Context

Need a monorepo layout that separates concerns and scales with the team.

## Decision

Full-stack monorepo:

```
apps/       — mobile (Flutter) + admin (web)
services/   — api (Node.js)
packages/   — shared api-client, types, config
infrastructure/ — docker, nginx, monitoring
database/   — migrations, seeders, schema
tests/      — cross-cutting test suites
docs/       — obsidian vault + api/db docs
```

## Consequences

- Single repo for atomic, cross-cutting changes
- Shared packages avoid type drift between client/server
- Infrastructure lives with code (infrastructure-as-code)

## Related

- `04 - ARCHITECTURE/System Architecture.md`