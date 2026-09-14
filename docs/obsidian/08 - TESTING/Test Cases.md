# Test Cases

## TC-001 — Registration
**Preconditions:** None  
**Steps:** `POST /auth/register` with valid data  
**Expected:** 201, user created, tokens returned

## TC-002 — Duplicate Email
**Steps:** Register with existing email  
**Expected:** 409 EMAIL_EXISTS

## TC-003 — Login Success
**Preconditions:** Registered user  
**Steps:** `POST /auth/login`  
**Expected:** 200, tokens returned

## TC-004 — Wrong Password
**Steps:** Login with incorrect password  
**Expected:** 401 INVALID_CREDENTIALS

## TC-005 — Protected Route Unauthorized
**Steps:** `GET /users/me` without token  
**Expected:** 401 UNAUTHORIZED

## TC-006 — Student Forbidden from Admin
**Preconditions:** Student role  
**Steps:** `GET /admin/users`  
**Expected:** 403 FORBIDDEN

## TC-007 — Feed Pagination
**Steps:** `GET /posts?page=1&limit=10` then `page=2`  
**Expected:** No duplicates, correct total

## TC-008 — Like Idempotency
**Steps:** Like same post twice  
**Expected:** Second like ignored, count stays 1

## TC-009 — Comment Ownership
**Steps:** User A tries to edit User B's comment  
**Expected:** 403 FORBIDDEN

## TC-010 — Search Results
**Steps:** `GET /search?q=campus`  
**Expected:** Relevant posts and announcements returned

## Related

- `08 - TESTING/Test Plan.md`