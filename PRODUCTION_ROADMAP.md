# SPO Production Roadmap

**Generated:** 2026-09-16  
**Branch:** `production-hardening`  
**Prerequisite:** Review and approval of `PRODUCTION_READINESS_AUDIT.md`

---

## Phasing Strategy

This roadmap sequences fixes so each phase has meaningful, independently testable outcomes. No complete rewrite is proposed — the existing architecture (React + Express + Firebase) is viable for production with targeted hardening.

---

## Phase 0: Build Fix (Unblocks Everything)

**Goal:** Make `npm install && npm run build` succeed  
**Estimated Duration:** 30 minutes  
**Blocking:** All subsequent phases

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 0.1 | Fix `firebase` version in `package.json` to latest available (e.g., `^11.x`) | `package.json` | P1-07 |
| 0.2 | Verify `npm install` completes | — | — |
| 0.3 | Verify `npm run build` completes | — | — |
| 0.4 | Fix `clean` script for cross-platform (`rimraf dist server.js`) | `package.json` | P3-02 |

**Exit Criteria:** `npm install && npm run build && npm run start` all succeed.

---

## Phase 1: Critical Security Hardening (P0)

**Goal:** Eliminate all authentication bypass vectors and data exposure  
**Estimated Duration:** 2-3 days  
**Blocking:** Any user-facing deployment

### 1A: Server-Side Auth & OTP Fix

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 1A.1 | Remove hardcoded OTP bypass codes (`'1234'`, `'123456'`) from verify endpoint | `server.ts` L148 | P0-01 |
| 1A.2 | Remove `previewOtp` from API response; gate behind `NODE_ENV === 'development'` | `server.ts` L118 | P0-02 |
| 1A.3 | Replace `Math.random()` OTP with `crypto.randomInt()` | `server.ts` L52 | P1-04 |
| 1A.4 | Add `express-rate-limit` to OTP send (5/15min) and verify (10/15min) endpoints | `server.ts` | P1-03 |
| 1A.5 | Add `helmet` security headers middleware | `server.ts` | P1-03 |
| 1A.6 | Add CORS middleware with explicit allowed origins | `server.ts` | P1-03 |
| 1A.7 | Add request body size limit (`express.json({ limit: '100kb' })`) | `server.ts` | P1-03 |

### 1B: Client-Side Auth Cleanup

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 1B.1 | Remove `validPins` array and all hardcoded passcodes from auth service | `authService.ts` | P0-01 |
| 1B.2 | Remove all `aadhaarFull` fields — keep only `aadhaarLast4` | `authService.ts` | P0-06 |
| 1B.3 | Remove the "graceful onboarding" that fabricates profiles for unknown users | `authService.ts` L449-465 | P0-07 |
| 1B.4 | Change `isDemoEnvironment()` to check `import.meta.env.PROD` | `authService.ts` L177 | P0-08 |
| 1B.5 | Remove hardcoded PINs from supervisor login; remove credential hints from error messages | `SupervisorLoginModal.tsx` L50, L80 | P0-05 |
| 1B.6 | Remove hardcoded passphrases from admin login; remove credential hints from error messages | `SuperAdminLoginModal.tsx` L42, L74 | P0-05 |
| 1B.7 | Conditionally exclude `DemoCredentialsDirectory` in production builds | `SupervisorLoginModal.tsx`, `SuperAdminLoginModal.tsx` | P3-05 |

### 1C: Firestore Security Rules

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 1C.1 | Rewrite `firestore.rules` with proper auth-gated access | `firestore.rules` | P0-03 |
| 1C.2 | Remove `defaultPasscode` from Firestore seeding | `firestoreDbService.ts` | P0-05 |
| 1C.3 | Restrict Firebase API key in Console (HTTP referrer, API restrictions) | Firebase Console | P0-04 |
| 1C.4 | Enable Firebase App Check | Firebase Console | P0-04 |

**Exit Criteria:** No hardcoded passcodes in source. OTP can only be verified with the actual generated code. Firestore denies unauthenticated access. No full Aadhaar in client bundle.

---

## Phase 2: Session Management & RBAC Enforcement

**Goal:** Implement proper JWT sessions and server-side role enforcement  
**Estimated Duration:** 3-4 days  
**Depends On:** Phase 1

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 2.1 | Install and configure `jsonwebtoken` (or Firebase Admin SDK token verification) | `server.ts`, `package.json` | P1-01 |
| 2.2 | Create `/api/auth/login` endpoint that issues signed JWT on successful OTP verification | `server.ts` | P1-01 |
| 2B.1 | Implement reusable Server-Side RBAC middleware (`requireRole`) | `server.ts` | P0-03 | ✅ Complete |
| 2B.2 | Protect all sensitive Express routes (e.g., `/api/ml/reallocate-and-predict`) with RBAC | `server.ts` | P0-03 | ✅ Complete |
| 2B.3 | Completely remove fallback to localStorage for security bounds | `App.tsx` | P0-03 | ✅ Complete |
| 2.6 | Move session state from localStorage to httpOnly cookie or secure token storage | `App.tsx` | P1-01 |
| 2.7 | Implement server-side RBAC middleware using JWT role claims | `server.ts` (new) | P1-02 |
| 2.8 | Set Firebase custom claims for supervisor/admin roles | Firebase Admin SDK | P1-02 |
| 2.9 | Replace anonymous Firebase auth with proper Firebase Auth (email/phone) | `firebaseConfig.ts` | P0-07 |

**Exit Criteria:** All API endpoints require valid JWT. Role is derived from JWT claims. Session expires after configured timeout.

---

## Phase 3: Persistent Audit Trail & OTP Store

**Goal:** Ensure audit logs and OTP state survive restarts  
**Estimated Duration:** 1-2 days  
**Depends On:** Phase 2

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 3.1 | Create server-side `/api/audit/log` endpoint (append-only, admin-SDK write) | `server.ts` (new route) | P1-06 |
| 3.2 | Modify `auditLog.ts` to post entries to server endpoint | `auditLog.ts` | P1-06 |
| 3.3 | Remove `reset()` method from production audit logger | `auditLog.ts` | P1-06 |
| 3.4 | Migrate OTP store from in-memory `Map` to Redis or Firestore | `server.ts` | P1-05 |
| 3.5 | Validate audit log entries in Firestore have `update: false, delete: false` in rules | `firestore.rules` | P1-06 |

**Exit Criteria:** Audit entries persist across page reloads and server restarts. OTP store survives server restart.

---

## Phase 4: ML Service Reliability

**Goal:** Make ML service deployable and robust  
**Estimated Duration:** 1 day  
**Depends On:** Phase 0

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 4.1 | Create `ml/requirements.txt` (pandas, scikit-learn, numpy) | `ml/requirements.txt` (new) | P1-08 |
| 4.2 | Fix `python3`/`python` cross-platform invocation | `server.ts` L176 | P1-08 |
| 4.3 | Add input validation and size limits on ML endpoint | `server.ts` | P1-09 |
| 4.4 | Use stdin pipe instead of argv for large payloads | `server.ts` | P1-09 |
| 4.5 | Add Python availability check at server startup | `server.ts` | P1-08 |

**Exit Criteria:** ML endpoint works on both Linux and Windows. Invalid input returns 400, not 500.

---

## Phase 5: ID Collision & Data Integrity

**Goal:** Eliminate duplicate ID generation  
**Estimated Duration:** 1 day  
**Depends On:** Phase 0

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 5.1 | Replace token number generation with UUID or sequential counter from Firestore | `bookingService.ts` L128 | P2-06 |
| 5.2 | Replace audit log ID generation with UUID | `auditLog.ts` L105 | P2-07 |
| 5.3 | Replace weighbridge slip number with counter-based unique ID | `weighbridgeService.ts` L81 | P2-08 |
| 5.4 | Replace token ID `tok-${Date.now()}` with UUID | `bookingService.ts` L138 | P2-06 |

**Exit Criteria:** Zero ID collisions under concurrent usage.

---

## Phase 6: Architecture Reliability

**Goal:** Improve application stability and maintainability  
**Estimated Duration:** 2-3 days  
**Depends On:** Phases 1-5

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 6.1 | Add React Error Boundary wrapping main app | `main.tsx`, `App.tsx` | P2-02 |
| 6.2 | Extract state management from App.tsx (context providers or state manager) | `App.tsx` | P2-01 |
| 6.3 | Enable TypeScript `strict` mode and fix resulting errors | `tsconfig.json` | P2-09 |
| 6.4 | Move `vite` to devDependencies only | `package.json` | P2-10 |
| 6.5 | Clear sensitive data from localStorage on logout | `App.tsx` | P2-03 |
| 6.6 | Add environment variable validation at server startup | `server.ts` | P3-07 |
| 6.7 | Rename package to `spo-production` and set version `1.0.0` | `package.json` | P3-01 |

**Exit Criteria:** App does not crash on component error. TypeScript strict mode passes. Sensitive data cleared on logout.

---

## Phase 7: Testing & CI/CD

**Goal:** Establish testing infrastructure and automated deployment  
**Estimated Duration:** 3-5 days  
**Depends On:** All previous phases

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 7.1 | Install Vitest for unit testing | `package.json` | — |
| 7.2 | Write unit tests for `authService` (identifier validation, no bypass) | `tests/authService.test.ts` (new) | — |
| 7.3 | Write unit tests for `weighbridgeService` (calculation correctness) | `tests/weighbridgeService.test.ts` (new) | — |
| 7.4 | Write unit tests for `bookingService` (conflict detection, state machine) | `tests/bookingService.test.ts` (new) | — |
| 7.5 | Write Firestore security rules unit tests with Firebase emulator | `tests/firestore.rules.test.ts` (new) | — |
| 7.6 | Write API integration tests for OTP endpoints | `tests/api.test.ts` (new) | — |
| 7.7 | Create `Dockerfile` for production deployment | `Dockerfile` (new) | — |
| 7.8 | Create `docker-compose.yml` with Node + Python services | `docker-compose.yml` (new) | — |
| 7.9 | Set up GitHub Actions CI pipeline | `.github/workflows/ci.yml` (new) | — |

**Exit Criteria:** All tests pass. CI pipeline runs on every push. Docker build succeeds.

---

## Phase 8: Production Deployment Readiness

**Goal:** Final deployment hardening  
**Estimated Duration:** 1-2 days  
**Depends On:** All previous phases

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 8.1 | Configure HTTPS (TLS termination via reverse proxy or cloud platform) | Deployment config | P2-05 |
| 8.2 | Set up production Firebase project (separate from dev) | Firebase Console | — |
| 8.3 | Configure production SMTP credentials | `.env` | — |
| 8.4 | Set `NODE_ENV=production` in deployment | Deployment config | — |
| 8.5 | Add health check monitoring | `server.ts` | — |
| 8.6 | Add error logging service (Sentry or equivalent) | `server.ts`, `App.tsx` | — |
| 8.7 | Add `robots.txt`, `sitemap.xml`, favicon | `public/` | P3-03, P3-04 |

**Exit Criteria:** Production deployment with HTTPS, monitoring, error tracking, and proper env config.

---

## Timeline Summary

| Phase | Duration | Depends On | Outcome |
|-------|----------|-----------|---------|
| Phase 0 | 30 min | — | Build works |
| Phase 1 | 2-3 days | Phase 0 | Critical security fixed |
| Phase 2 | 3-4 days | Phase 1 | JWT sessions + RBAC |
| Phase 3 | 1-2 days | Phase 2 | Persistent audit + OTP |
| Phase 4 | 1 day | Phase 0 | ML service reliable |
| Phase 5 | 1 day | Phase 0 | No ID collisions |
| Phase 6 | 2-3 days | Phases 1-5 | App stability |
| Phase 7 | 3-5 days | All | Tests + CI/CD |
| Phase 8 | 1-2 days | All | Deployment ready |
| **Total** | **~15-21 days** | | **Production-ready SPO** |
