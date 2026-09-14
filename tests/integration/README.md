# Integration tests live here.
#
# These hit a real API + MySQL + Redis stack and verify critical endpoints:
#   - auth register/login/refresh
#   - feed pagination
#   - likes (no duplicates)
#   - comment ownership rules
#   - announcement publish + notification trigger
#
# Run with: npm --prefix services/api/node_api run test:integration