# Known Issues

| ID | Description | Impact | Workaround |
|----|-------------|--------|------------|
| BUG-002 | Refresh tokens remain valid after rotation | Security concern | Rotate more frequently; add Redis session store |
| BUG-003 | Like count shows stale cached value in feed | UI shows wrong count | Pull-to-refresh to see updated count |
| BUG-004 | Search crashes on special characters (`%`, `_`) | Search breaks for some queries | Escape user input before LIKE |
| BUG-005 | Push tokens stay active after user logout | Phantom notifications | Add token invalidation on logout |

## Related

- `09 - BUG TRACKING/Bug Tracker.md`