# Login

## Screen Purpose
Allow users to authenticate with email and password.

## Elements
- App logo/brand
- Email input
- Password input
- Sign In button (primary)
- "Forgot password?" link (Phase 2)
- Error feedback (inline)

## States
- Loading: button disabled + spinner
- Error: banner or inline message
- Success: navigate to `/home`

## Related

- `features/auth/screens/login_screen.dart`
- `06 - API/Authentication.md`