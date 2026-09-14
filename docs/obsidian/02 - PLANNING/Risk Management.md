# Risk Management

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| MySQL data loss | Low | High | Regular backups via `scripts/backup.sh`; test restores |
| Redis cache invalidation bugs | Medium | Medium | Invalidate on every mutation; never treat Redis as source of truth |
| Push token staleness | Medium | Low | Deactivate invalid tokens after FCM feedback |
| Scope creep | High | High | Strict adherence to roadmap phases; defer future features |
| Key developer unavailability | Medium | Medium | Obsidian docs kept current; standard code style |

## Related

- [[02 - PLANNING/Roadmap|Roadmap]]
- [[04 - ARCHITECTURE/Redis Architecture|Redis Architecture]]