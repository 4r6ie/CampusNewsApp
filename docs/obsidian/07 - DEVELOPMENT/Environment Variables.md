# Environment Variables

## Root `.env`

Copy `.env.example` to `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://campus_app:change_me@mysql:3306/campus_news
REDIS_URL=redis://redis:6379
JWT_ACCESS_SECRET=dev_access_secret_change_in_production
JWT_REFRESH_SECRET=dev_refresh_secret_change_in_production
FCM_PROJECT_ID=
FCM_CLIENT_EMAIL=
FCM_PRIVATE_KEY=
```

## Flutter Config

`apps/mobile/flutter_app/lib/app/app_config.dart` — API base URL.

## Production

- Use secret manager (AWS SSM, GCP Secret Manager, Vault)
- Never commit production secrets
- Rotate JWT secrets periodically
- Firebase credentials must be valid for push notifications

## Related

- `.env.example`
- `07 - DEVELOPMENT/Installation.md`