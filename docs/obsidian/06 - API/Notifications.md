# Notifications

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | /notifications | List user notifications |
| PATCH | /notifications/:id/read | Mark as read |
| POST | /devices | Register push device |
| DELETE | /devices/:id | Remove device |

## Notification Events

- Urgent announcement published
- New campus news (if enabled by preference)
- Comment reply (if implemented)
- Admin broadcast

## Device Management

Tokens registered via `POST /devices`. Invalid tokens deactivated after FCM provider feedback.

## Related

- `services/api/node_api/src/modules/notifications/`
- `services/api/node_api/src/modules/devices/`