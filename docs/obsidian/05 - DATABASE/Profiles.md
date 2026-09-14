# Profiles

| Column | Type | Notes |
|--------|------|-------|
| user_id | VARCHAR(36) | PK, FK → users |
| student_no | VARCHAR(20) | Unique, nullable |
| full_name | VARCHAR(100) | Required |
| course | VARCHAR(100) | Optional |
| year_level | VARCHAR(20) | Optional |
| avatar_url | VARCHAR(500) | Optional |
| bio | TEXT | Optional |

## Related

- `database/migrations/002_profiles.sql`
- `06 - API/Users.md`