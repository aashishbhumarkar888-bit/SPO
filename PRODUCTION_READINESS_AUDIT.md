# SPO Production Readiness Audit

**Audit Date:** 2026-09-16  
**Branch:** `production-hardening`  
**Auditor:** Automated deep audit  
**Application:** SPO — Smart Procurement Orchestration (AgriSeva Mandi Portal)  
**Architecture:** React 19 SPA + Express backend + Firebase/Firestore + Python ML service

---

## Architecture Summary

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, Lucide icons, Motion | Single-page app, monolithic `App.tsx` (~33KB, ~800 lines) |
| Backend | Express 4 (TypeScript, `server.ts`) | 4 API routes: health, send-OTP, verify-OTP, ML prediction |
| Database | Firebase Firestore (client SDK v12) | Anonymous auth, client-side reads/writes |
| Auth | Custom SMTP OTP + anonymous Firebase + hardcoded demo PINs | No session tokens, no JWT |
| ML | Python 3 + Pandas + Scikit-Learn (`ml/dynamic_allocator.py`) | Subprocess invocation from Express |
| State | localStorage + React in-memory state | Full farmer profiles, sessions, tokens persisted client-side |
| i18n | 56KB monolithic translation file | Hindi, English, Marathi, Punjabi |
| Tests | **None** | No test framework, no test files, no test scripts |
| Deployment | Vite build + esbuild server bundle | No Dockerfile, no CI/CD, no staging |

---

## P0 — Critical Security / Data-Loss / Production Blockers

### P0-01: OTP Bypass — Hardcoded Universal Passcodes in Server and Client

**Files:**
- `server.ts` — Line 148
- `src/services/authService.ts` — Line 401

**Problem:** The OTP verification endpoint accepts `'1234'` and `'123456'` as valid for ANY email, bypassing the actual generated OTP. The client-side farmer auth accepts `['1234', '123456', '0000', 'admin123', '9999', '4321']` for ANY identifier.

**Current Behavior:** Any user can authenticate as any farmer, supervisor, or admin by entering `1234` as the OTP/PIN.

**Risk:** **Complete authentication bypass.** Any unauthenticated user can impersonate any farmer and access their Aadhaar data, land records, bank details, DBT transactions, and initiate procurement actions.

**Required Fix:**
1. Remove all hardcoded valid PINs from `server.ts` verify endpoint
2. Remove `validPins` array from `authService.ts`
3. Implement proper OTP verification — compare ONLY against the generated code
4. Add rate limiting and lockout on verify endpoint
5. Gate `isDemoEnvironment()` to return `false` in production

**Dependencies:** SMTP must be configured for OTP delivery  
**Test Required:** End-to-end OTP flow test; negative test with invalid codes

---

### P0-02: OTP Returned in API Response (previewOtp)

**File:** `server.ts` — Line 118

**Problem:** The `send-smtp-otp` endpoint returns the generated OTP code in the JSON response body (`previewOtp: otpCode`) regardless of whether SMTP is configured.

**Current Behavior:** Any HTTP client can call `POST /api/auth/send-smtp-otp` and receive the valid OTP in the response, making the OTP mechanism completely ceremonial.

**Risk:** Complete OTP bypass via API inspection; any attacker can extract the code from the response.

**Required Fix:**
1. Never return OTP in API response in production
2. Add environment-gated guard: only include `previewOtp` when `NODE_ENV === 'development'`
3. Remove `note` field that documents the bypass

**Dependencies:** None  
**Test Required:** Verify response body does not contain OTP in production mode

---

### P0-03: Firestore Security Rules — Full Public Read/Write on All Collections

**File:** `firestore.rules`

**Problem:** Every collection (`farmers`, `tokens`, `staff_users`) allows `read: if true` and `write: if true`. The `audit_logs` collection allows public read and create.

**Current Behavior:** Any anonymous user (or attacker) can:
- Read all farmer PII (names, phone numbers, Aadhaar last 4, bank IFSC, email)
- Read all staff credentials and passcodes (stored as `defaultPasscode` in `staff_users`)
- Modify/delete any farmer record, token, or staff record
- Read all audit logs
- Create fraudulent audit entries

**Risk:** **Total data breach exposure.** Farmer PII, bank details, and staff credentials are publicly accessible to anyone with the Firebase project config (which is embedded in `firebase-applet-config.json` committed to the repo).

**Required Fix:**
1. Restrict `farmers` reads to authenticated user matching `farmerId` or staff role
2. Restrict `staff_users` reads to authenticated staff users only
3. Restrict all writes to authenticated + role-verified users
4. Never store `defaultPasscode` in Firestore — use Firebase Auth custom claims
5. `audit_logs` should be write-only from server-side admin SDK, not client

**Dependencies:** Firebase Auth custom claims setup, server-side admin SDK  
**Test Required:** Security rules unit tests with Firebase emulator

---

### P0-04: Firebase API Key and Project Config Committed to Source

**File:** `firebase-applet-config.json`

**Problem:** Firebase `apiKey`, `appId`, `projectId`, `messagingSenderId`, and `oAuthClientId` are committed in plain JSON. Combined with P0-03 (open Firestore rules), this gives any attacker direct database access.

**Current Behavior:** Anyone cloning the repo can access the production Firestore and Auth instances.

**Risk:** With open security rules, this is equivalent to publishing the full database publicly.

**Required Fix:**
1. Lock down Firestore rules first (P0-03) — the API key alone is not secret if rules are correct
2. Restrict API key via Firebase Console (HTTP referrer restrictions, API restrictions)
3. Enable App Check to verify legitimate client origins
4. Consider moving config to environment variables for flexibility

**Dependencies:** P0-03 must be fixed first  
**Test Required:** Verify unauthorized access is blocked after rules lockdown

---

### P0-05: Staff Default Passcodes Stored in Firestore and Source Code

**Files:**
- `src/services/firestoreDbService.ts` — `defaultPasscode: '1234'`
- `src/services/authService.ts` — `demoPasscode: '1234'`, `demoPasscode: 'admin2026'`
- `src/components/supervisor/SupervisorLoginModal.tsx` — hardcoded PINs
- `src/components/superadmin/SuperAdminLoginModal.tsx` — hardcoded passphrases

**Problem:** Staff passwords are:
1. Hardcoded in source code in plain text
2. Seeded into Firestore as `defaultPasscode` field (publicly readable per P0-03)
3. Displayed in UI error messages ("`Authorized field PIN: 1234`", "`Authorized credentials: admin2026, gov2026, or 1234`")

**Current Behavior:** Every supervisor uses PIN `1234`. The super admin passphrase `admin2026` is in the source. The error message explicitly tells attackers what the correct PIN is.

**Risk:** Anyone can assume any supervisor or super admin identity.

**Required Fix:**
1. Remove all hardcoded passcodes from source code
2. Never store passcodes in Firestore document fields
3. Use Firebase Auth with proper password hashing or SSO/LDAP
4. Never reveal valid credentials in error messages
5. Remove `DemoCredentialsDirectory` component from production builds

**Dependencies:** Firebase Auth custom claims or external identity provider  
**Test Required:** Verify no valid credentials in error messages; verify auth against proper backend

---

### P0-06: Full 12-Digit Aadhaar Numbers Hardcoded in Source Code

**File:** `src/services/authService.ts` — Lines 217-347

**Problem:** Seven full 12-digit Aadhaar numbers are hardcoded in the `SEEDED_DEMO_ACCOUNTS` array as `aadhaarFull` (e.g., `'5678 1234 9082'`). These are shipped to every client in the JavaScript bundle.

**Current Behavior:** Full Aadhaar numbers are in the client-side JS bundle, visible to any user via browser DevTools.

**Risk:** Violation of UIDAI Aadhaar (Targeted Delivery of Financial Subsidies) Act regulations and DPDPA 2023. Even if these are fictional, shipping the pattern normalizes full Aadhaar handling and the code infrastructure exists to store real ones.

**Required Fix:**
1. Remove all `aadhaarFull` fields from client-side code
2. Store only `aadhaarLast4` for display
3. Never ship full Aadhaar to the client — any verification must be server-side
4. Audit Firestore for stored full Aadhaar values

**Dependencies:** Server-side Aadhaar verification API  
**Test Required:** Bundle analysis to confirm no 12-digit numbers in client code

---

### P0-07: No Server-Side Authentication — All Auth is Client-Side

**Files:**
- `server.ts` — No auth middleware
- `src/services/authService.ts` — Fabricates farmer profiles for any input (Lines 449-465)

**Problem:** The Express backend has zero authentication middleware. The `/api/ml/reallocate-and-predict` endpoint accepts unauthenticated requests. The farmer auth (`authenticateFarmerAsync`) fabricates a valid farmer profile for ANY identifier not found in the database, meaning authentication never fails.

**Current Behavior:** Anyone entering any 10 or 12-digit number gets a fabricated farmer profile and full system access. All API endpoints are unauthenticated.

**Risk:** No access control at any layer. Any user can invoke ML predictions, send OTPs, or perform any action.

**Required Fix:**
1. Add authentication middleware to Express (JWT or Firebase Admin token verification)
2. Remove the "graceful onboarding" fallback that fabricates farmer profiles
3. Authentication must fail for unknown identifiers
4. All API endpoints must verify caller identity

**Dependencies:** JWT implementation or Firebase Admin SDK  
**Test Required:** Verify 401 responses for unauthenticated API calls

---

### P0-08: `isDemoEnvironment()` Always Returns `true`

**File:** `src/services/authService.ts` — Line 177

**Problem:** `isDemoEnvironment()` is hardcoded to `return true`, providing no mechanism to disable demo mode.

**Current Behavior:** Demo credentials, passcode bypass, and credential directories are always active.

**Risk:** All demo bypass mechanisms are permanently enabled, even in production.

**Required Fix:**
1. Gate on `process.env.NODE_ENV !== 'production'` or a dedicated feature flag
2. Conditionally strip demo components from production builds

**Dependencies:** Environment variable configuration  
**Test Required:** Verify demo features are disabled when flag is off

---

## P1 — Major Functional / Architecture Problems

### P1-01: No Session Token / JWT System

**Files:**
- `src/App.tsx` — localStorage session management
- `server.ts` — No session middleware

**Problem:** After "authentication," no session token, JWT, or server-side session is created. Role state is stored in `localStorage` as JSON objects. The server has no concept of who is calling.

**Current Behavior:** Supervisor and super admin "sessions" are serialized JSON in `localStorage`. Anyone can edit `localStorage` to escalate privileges.

**Risk:** Privilege escalation via localStorage manipulation. No session expiry enforcement.

**Required Fix:**
1. Implement JWT-based session management
2. Server signs tokens on successful auth, client sends in Authorization header
3. Implement refresh token rotation
4. Server validates JWT on every API call

**Dependencies:** JWT library, server-side user store  
**Test Required:** Verify session creation, validation, expiry, and refresh

---

### P1-02: RBAC Not Enforced — Frontend-Only Authorization

**Files:**
- `src/domain/permissions.ts` — Well-defined but client-only
- `src/App.tsx` — Role switching by UI state

**Problem:** The RBAC permission system (`hasPermission`, `assertPermission`) exists but is only enforced in the frontend React layer. The backend has zero authorization checks. Role is determined by `localStorage` values.

**Current Behavior:** A "farmer" user can directly access supervisor or admin functions by modifying `localStorage` or calling APIs directly.

**Risk:** Any user can perform any action regardless of assigned role.

**Required Fix:**
1. Enforce RBAC on the server for every API endpoint
2. Derive role from authenticated JWT claims, not client-supplied data
3. Use Firebase custom claims for role assignment

**Dependencies:** P1-01 (JWT sessions)  
**Test Required:** Verify each role can only access authorized endpoints

---

### P1-03: Express API Has No Rate Limiting, CORS, Helmet, or CSRF Protection

**File:** `server.ts`

**Problem:** The Express server has zero security middleware:
- No rate limiting (OTP flood, brute force)
- No CORS configuration (any origin can call APIs)
- No Helmet.js (missing security headers)
- No CSRF protection
- No request size limits beyond Express default

**Current Behavior:** Unlimited OTP send/verify requests from any origin.

**Risk:** OTP brute-force (6-digit OTP crackable in ~1M requests), SMTP abuse, cross-origin attacks.

**Required Fix:**
1. Add `express-rate-limit` with appropriate windows
2. Configure CORS to allow only authorized origins
3. Add `helmet` for security headers
4. Add CSRF protection for state-changing endpoints
5. Limit request body size explicitly

**Dependencies:** npm packages: `helmet`, `express-rate-limit`, `cors`  
**Test Required:** Verify rate limiting triggers, CORS blocks unauthorized origins

---

### P1-04: OTP Generated with `Math.random()` — Not Cryptographically Secure

**File:** `server.ts` — Line 52

**Problem:** `Math.floor(100000 + Math.random() * 900000)` uses a non-cryptographic PRNG. OTP values are predictable.

**Current Behavior:** OTP generation uses V8's `Math.random()`, which is not suitable for security tokens.

**Risk:** OTP prediction attack if attacker can determine PRNG state.

**Required Fix:** Use `crypto.randomInt(100000, 999999)` from Node.js `crypto` module.

**Dependencies:** None (Node.js built-in)  
**Test Required:** Verify OTP uses crypto module

---

### P1-05: In-Memory OTP Store — Lost on Server Restart

**File:** `server.ts` — Line 25 (`emailOtpStore = new Map()`)

**Problem:** OTPs are stored in a `Map` in server memory. Any server restart clears all pending OTPs. In a multi-instance deployment, OTPs from instance A cannot be verified on instance B.

**Current Behavior:** Server restart invalidates all in-progress authentications.

**Risk:** Authentication failures after deploy/restart; does not scale horizontally.

**Required Fix:** Use Redis, Firestore, or another persistent store for OTP entries.

**Dependencies:** Redis or Firestore admin SDK  
**Test Required:** Verify OTP survives server restart; verify multi-instance verification

---

### P1-06: Audit Logs Are In-Memory Only — Lost on Page Reload

**File:** `src/domain/auditLog.ts`

**Problem:** The `AuditLoggerService` stores logs in a JavaScript array (`this.logs`). Firestore audit_logs collection exists but audit entries are NOT persisted to it from the client — only the initial seed data is written.

**Current Behavior:** All audit entries from a session are lost when the user refreshes the page. The `reset()` method discards all logs.

**Risk:** No persistent audit trail. For a government procurement system handling financial transactions, this is a regulatory compliance failure.

**Required Fix:**
1. Persist every audit entry to Firestore (or server-side audit endpoint)
2. Audit writes must be append-only and non-deletable
3. Server-side audit logging with Firebase Admin SDK (client can't tamper)
4. Remove the `reset()` method in production

**Dependencies:** Firestore admin SDK, server-side audit endpoint  
**Test Required:** Verify audit entries persist across sessions; verify immutability

---

### P1-07: npm Build Fails — `firebase@^12.19.0` Does Not Exist

**File:** `package.json` — Line 21

**Problem:** `firebase@^12.19.0` does not exist in npm registry. `npm install` fails with `ETARGET`.

**Current Behavior:** Fresh clone cannot install dependencies. Build is completely broken.

**Risk:** Cannot deploy. Cannot onboard new developers. CI/CD would fail.

**Required Fix:** Pin to latest available Firebase SDK version (currently `^11.x` or check npm for latest).

**Dependencies:** None  
**Test Required:** `npm install && npm run build` succeeds

---

### P1-08: Python ML Subprocess Uses `python3` — Fails on Windows

**File:** `server.ts` — Line 176

**Problem:** `execFile('python3', ...)` will fail on Windows where the command is `python`. No Python dependency check at startup. No virtual environment. Python dependencies (pandas, scikit-learn, numpy) are not declared in any `requirements.txt`.

**Current Behavior:** ML endpoint fails silently on Windows. No requirements file for Python dependencies.

**Risk:** ML feature non-functional on most deployment targets.

**Required Fix:**
1. Create `ml/requirements.txt` with `pandas`, `scikit-learn`, `numpy`
2. Try `python3` first, fall back to `python`
3. Check Python availability at startup
4. Consider dockerizing the Python environment

**Dependencies:** Python 3.10+, pip  
**Test Required:** Verify ML endpoint works on deployment target OS

---

### P1-09: No Input Sanitization on ML Endpoint

**File:** `server.ts` — Lines 166-202

**Problem:** The `/api/ml/reallocate-and-predict` endpoint passes user-supplied JSON directly as a command-line argument to a Python subprocess via `execFile`. While `execFile` is safer than `exec`, the entire JSON payload is passed as `argv[1]`, which can contain arbitrary data.

**Current Behavior:** No validation of `tokens` array contents or `counters` value before passing to Python.

**Risk:** Denial of service via very large payloads; unexpected Python behavior from malformed input.

**Required Fix:**
1. Validate and sanitize input before passing to Python
2. Limit array size and numeric ranges
3. Use stdin pipe instead of argv for large payloads

**Dependencies:** None  
**Test Required:** Fuzz test with malformed inputs

---

## P2 — Reliability / Quality / Performance

### P2-01: Monolithic App.tsx (~33KB, 800+ Lines)

**File:** `src/App.tsx`

**Problem:** Main component file is ~33KB containing all state management, routing logic, role switching, data persistence, and rendering. Extremely difficult to maintain, test, or debug.

**Risk:** High maintenance burden; any change risks regression.

---

### P2-02: No Error Boundaries in React App

**File:** `src/main.tsx`

**Problem:** No React Error Boundary components. Any unhandled error crashes the entire application.

**Risk:** Single component error takes down the whole app.

---

### P2-03: Sensitive Data in localStorage Without Encryption

**File:** `src/App.tsx`

**Problem:** Full farmer profiles (names, Aadhaar last4, phone, bank IFSC, email), supervisor sessions, and admin sessions are serialized as plain JSON in `localStorage`. This data persists even after logout if not explicitly cleared.

**Risk:** Data accessible to any JavaScript on the same origin (XSS); persists on shared devices.

---

### P2-04: No Offline/PWA Support Despite Claims

Feature registry claims "Offline Available (PWA)" but there is no service worker, no manifest.json, no IndexedDB usage, no offline cache strategy.

**Risk:** Marketing/compliance claims do not match implementation.

---

### P2-05: No HTTPS Enforcement

**File:** `server.ts` — Binds to `http://0.0.0.0:3000`

**Problem:** Server listens on plain HTTP. No TLS termination, no HSTS headers, no redirect to HTTPS.

**Risk:** All data (including OTPs, Aadhaar, bank info) transmitted in plaintext.

---

### P2-06: Token Number Collision Possible

**File:** `src/services/bookingService.ts` — Line 128

**Problem:** Token numbers generated as `AS-${Math.floor(100 + Math.random() * 900)}` — only 900 possible values. Token IDs use `tok-${Date.now()}` which can collide in concurrent requests.

**Risk:** Duplicate token numbers and IDs in production.

---

### P2-07: Audit Log ID Collision

**File:** `src/domain/auditLog.ts` — Line 105

**Problem:** Audit IDs generated as `AUD-LOG-${Date.now().toString().slice(-6)}` — only 6 digits, collisions guaranteed under any load.

**Risk:** Duplicate audit entries, lost audit trail.

---

### P2-08: Weighbridge Slip Number Not Unique

**File:** `src/services/weighbridgeService.ts` — Line 81

**Problem:** `APMC-WB-${Date.now().toString().slice(-5)}` — 5 digits, easy collisions.

**Risk:** Non-unique financial document references.

---

### P2-09: No `strict` Mode in tsconfig

**File:** `tsconfig.json`

**Problem:** TypeScript `strict` mode is not enabled. No `strictNullChecks`, no `noImplicitAny`, no `strictPropertyInitialization`.

**Risk:** Type safety gaps; potential runtime `undefined` errors.

---

### P2-10: `vite` Listed in Both dependencies and devDependencies

**File:** `package.json`

**Problem:** `vite` appears in both `dependencies` and `devDependencies`.

**Risk:** Unnecessary production bundle bloat.

---

## P3 — Polish / Improvement

### P3-01: Package Name is `react-example` with Version `0.0.0`

**File:** `package.json`

---

### P3-02: `.clean` Script Uses Unix `rm -rf` — Fails on Windows

**File:** `package.json`

---

### P3-03: No Favicon or PWA Icons

---

### P3-04: No `robots.txt` or `sitemap.xml`

---

### P3-05: Demo Credentials Directory Visible in Production UI

**File:** `src/components/common/DemoCredentialsDirectory.tsx`

**Problem:** The `DemoCredentialsDirectory` component that shows all demo accounts (with full Aadhaar numbers, passcodes, and identifiers) is rendered in both supervisor and admin login modals with `defaultExpanded={true}`.

---

### P3-06: i18n File is 56KB Monolith

**File:** `src/i18n/index.ts` — 56KB

Should be split per language for code-splitting.

---

### P3-07: Missing `.env` File Causes Silent Fallback

No validation that required environment variables are present at startup.

---

## Summary Matrix

| Priority | Count | Categories |
|----------|-------|-----------|
| **P0** | 8 | Auth bypass, OTP leak, Firestore rules, Aadhaar exposure, no server auth |
| **P1** | 9 | No JWT, no RBAC enforcement, no security headers, build broken, ML issues |
| **P2** | 10 | Architecture debt, error handling, data at rest, ID collisions |
| **P3** | 7 | Polish, naming, platform compatibility |
