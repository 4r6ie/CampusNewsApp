# Resolved Bugs

| Bug ID | Title | Date Resolved | Fix Summary | Regression Test |
|--------|-------|---------------|-------------|-----------------|
| BUG-001 | Feed crashes when image URL is missing | — | Added fallback image widget for null/empty URLs | Widget test added |
| BUG-002 | Refresh token not rotating correctly | 2026-09-18 | `jti` claim + Redis session store; refresh consumes and reissues tokens; logout revokes the session | `tests/unit/token.test.ts` updated |
| BUG-003 | Like count drifts from likes table | 2026-09-18 | Likes now invalidate post detail cache (`post:*:{postId}`) in addition to feed cache | — |
| BUG-004 | Search fails on special characters | 2026-09-18 | LIKE wildcards (`%`, `_`, `\`) escaped before pattern build | — |
| BUG-005 | Notification tokens persist after logout | 2026-09-18 | `/auth/logout` authenticated; revokes session + deactivates user devices; mobile client calls server on logout | — |

## BUG-001 — Feed crashes when image URL is missing

**Root Cause:** Null URL not handled in image widget.  
**Fix:** `CachedNetworkImage` with `errorWidget` fallback to `Icon(Icons.broken_image)`.  
**Regression:** Widget test verifying placeholder displays for empty URL.

## Related

- `09 - BUG TRACKING/Bug Tracker.md`