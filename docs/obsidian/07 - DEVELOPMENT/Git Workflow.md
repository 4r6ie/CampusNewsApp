# Git Workflow

## Branches

- `main` — production-ready code
- `develop` — integration branch (if using Git Flow)
- `feature/*` — new features
- `fix/*` — bug fixes
- `hotfix/*` — urgent production fixes

## Commit Conventions

```
feat(scope): description
fix(scope): description
docs(scope): description
refactor(scope): description
test(scope): description
chore(scope): description
```

Examples:
- `feat(feed): add paginated news feed`
- `feat(auth): add JWT login`
- `fix(comments): prevent duplicate submission`
- `docs(api): document notification endpoints`
- `refactor(redis): isolate cache service`

## Definition of Done

- Requirement implemented
- Validation and authorization included
- Tests added where appropriate
- UI loading/error/empty states handled
- Documentation updated in Obsidian
- No critical lint/build errors
- Pull request reviewed

## Related

- `07 - DEVELOPMENT/Coding Standards.md`