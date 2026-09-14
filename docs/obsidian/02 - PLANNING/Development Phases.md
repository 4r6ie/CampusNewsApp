# Development Phases

## Recommended Build Order

1. Docker + MySQL + Redis
2. Node.js API foundation
3. Flutter foundation
4. Authentication
5. Student profiles
6. News feed
7. Announcements
8. Likes
9. Comments
10. Search
11. Push notifications
12. Redis optimization
13. Admin dashboard
14. Testing
15. Bug fixing
16. Production deployment

## Exit Criteria per Phase

| Phase | Exit Criteria |
|-------|---------------|
| 2. Foundation | All containers healthy, migrations run |
| 5. Authentication | Protected endpoints working, JWT flow correct |
| 7. News Feed | Paginated feed loads reliably |
| 9. Announcements | Urgent announcements trigger notifications |
| 11. Search | Search returns relevant, paginated results |
| 15. Testing | Critical defects closed |

## Related

- [[02 - PLANNING/Roadmap|Roadmap]]
- [[07 - DEVELOPMENT/Installation|Installation]]