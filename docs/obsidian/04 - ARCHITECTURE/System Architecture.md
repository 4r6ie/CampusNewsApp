# System Architecture

```
                  ┌────────────────────┐
                  │   Flutter Mobile    │
                  │       App          │
                  └─────────┬──────────┘
                            │
                         HTTPS/JSON
                            │
                  ┌─────────▼──────────┐
                  │     Node.js API    │
                  │      :3000         │
                  └─────────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
       ┌──────▼──────┐             ┌──────▼──────┐
       │    MySQL    │             │    Redis    │
       │   :3306     │             │    :6379    │
       │  Permanent  │             │    Cache    │
       │    Data     │             │   /Speed    │
       └─────────────┘             └─────────────┘
              │
       ┌──────▼────────┐
       │ Firebase FCM  │
       │ Push Alerts   │
       └───────────────┘
```

**Docker** manages backend infrastructure.  
**Obsidian** manages project documentation.

## Components

| Component | Responsibility |
|-----------|---------------|
| Flutter | UI, client state, API calls, notification handling |
| Node.js API | Routing, auth, validation, business logic |
| MySQL | Permanent source of truth for all relational data |
| Redis | Cache, rate limiting, deduplication |
| FCM | Mobile push notification delivery |

## Architecture Rules

> Flutter handles the UI and client-side state. Node.js handles API routes, authentication, authorization, validation, and business logic. MySQL is the permanent source of truth. Redis is an optimization layer — never the permanent database. Docker manages backend infrastructure. Obsidian is the living documentation workspace.

## See Also

- [[04 - ARCHITECTURE/Flutter Architecture|Flutter Architecture]]
- [[04 - ARCHITECTURE/Backend Architecture|Backend Architecture]]
- [[04 - ARCHITECTURE/Database Architecture|Database Architecture]]