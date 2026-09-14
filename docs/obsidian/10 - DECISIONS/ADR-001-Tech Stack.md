# ADR-001 — Tech Stack

**Status:** Accepted  
**Date:** September 14, 2026

## Context

Need a full-stack campus communication platform for Android/iOS/web with a maintainable backend, relational data, caching, push notifications, and reproducible dev environment.

## Decision

- **Frontend:** Flutter (single codebase, high performance)
- **Backend:** Node.js + TypeScript + Express
- **Database:** MySQL 8 (relational fit, mature tooling)
- **Cache:** Redis (ioredis)
- **Push:** Firebase Cloud Messaging
- **Containers:** Docker + Docker Compose
- **Docs:** Obsidian vault

## Consequences

- Redis is never the permanent source of truth
- Flutter mobile runtime not containerized; Docker is for backend
- UTC storage → local display conversion
- Previously used React Native/Expo was replaced

## Related

- `04 - ARCHITECTURE/System Architecture.md`