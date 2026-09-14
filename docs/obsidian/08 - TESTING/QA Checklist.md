# QA Checklist

## Pre-Release

- [ ] All critical test cases pass (see Test Cases.md)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No Flutter analysis errors (`flutter analyze`)
- [ ] Docker stack starts cleanly (`docker compose up -d`)
- [ ] Migrations run on clean database
- [ ] Seed data present (admin + student accounts)
- [ ] Health check returns 200
- [ ] Auth flow: register → login → refresh → logout
- [ ] Feed loads, paginates, refreshes
- [ ] Like/unlike works, count correct
- [ ] Comments: create, edit own, delete own, admin moderate
- [ ] Announcements: create, display by priority, urgent triggers notification
- [ ] Search returns relevant results
- [ ] No critical security findings
- [ ] Obsidian docs up to date

## Post-Release

- [ ] Production smoke test passes
- [ ] Backups running
- [ ] Monitoring/alerts configured
- [ ] No high-severity bugs open

## Related

- `08 - TESTING/Test Plan.md`
- `11 - RELEASES/Deployment Notes.md`