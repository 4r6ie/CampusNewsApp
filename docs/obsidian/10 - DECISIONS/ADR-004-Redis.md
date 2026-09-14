# ADR-004 — Redis

**Status:** Accepted  
**Date:** September 14, 2026

## Context

Need fast caching, rate limiting, and notification deduplication without compromising data durability.

## Decision

- **Redis 7** via ioredis
- Pattern-based keys: `feed:home:*`, `post:*`, `search:*`, `rate:*`, `notification:*`
- Hard TTLs on all keys
- Cache invalidation on every mutation
- Redis is NEVER the source of truth

## Consequences

- Flushing Redis safely recovers fully from MySQL
- Feed/search latency improved with bounded staleness

## Related

- `04 - ARCHITECTURE/Redis Architecture.md`
- `services/api/node_api/src/cache/`