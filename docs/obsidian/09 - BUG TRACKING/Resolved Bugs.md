# Resolved Bugs

| Bug ID | Title | Date Resolved | Fix Summary | Regression Test |
|--------|-------|---------------|-------------|-----------------|
| BUG-001 | Feed crashes when image URL is missing | — | Added fallback image widget for null/empty URLs | Widget test added |

## BUG-001 — Feed crashes when image URL is missing

**Root Cause:** Null URL not handled in image widget.  
**Fix:** `CachedNetworkImage` with `errorWidget` fallback to `Icon(Icons.broken_image)`.  
**Regression:** Widget test verifying placeholder displays for empty URL.

## Related

- `09 - BUG TRACKING/Bug Tracker.md`