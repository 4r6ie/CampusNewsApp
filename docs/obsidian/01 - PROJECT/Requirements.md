# Requirements

## Functional Requirements

| ID | Requirement | Acceptance Summary |
|----|-------------|-------------------|
| FR-01 | Authentication | Valid users can log in and access protected features |
| FR-02 | Profiles | Users can view/edit allowed profile fields |
| FR-03 | Feed | Users can browse paginated posts |
| FR-04 | Announcements | Official notices are displayed with priority/status |
| FR-05 | Likes | A user can like/unlike once per post |
| FR-06 | Comments | Authorized users can create/update/delete their comments |
| FR-07 | Search | Users can search supported content |
| FR-08 | Notifications | Registered devices can receive configured pushes |
| FR-09 | Authorization | Admin-only operations reject unauthorized users |
| FR-10 | Moderation | Admins can remove/flag inappropriate content |

## Non-Functional Requirements

- HTTPS/TLS in production
- Password hashing with bcrypt
- JWT expiration and refresh-token controls
- Rate limiting on auth, search, and comment routes
- UTC timestamps in storage; local time display in client
- Docker-reproducible development environment
- Obsidian docs kept in sync with codebase

## See Also

- [[06 - API/API Overview|API Overview]]
- [[05 - DATABASE/ERD|ERD]]