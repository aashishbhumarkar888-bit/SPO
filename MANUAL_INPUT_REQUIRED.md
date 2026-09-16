# Manual Input Required

**Generated:** 2026-09-16  
**Context:** SPO Production Readiness Audit  
**Purpose:** Only items that genuinely require your decision, credentials, or access

---

## 1. Production SMTP Credentials

**Why:** The OTP email delivery system requires working SMTP credentials. The current `.env.example` has empty `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`.

**What I need from you:**
- SMTP host (e.g., `smtp.gmail.com`, your org mail server, or transactional service like SendGrid/Mailgun)
- SMTP username
- SMTP password or API key
- SMTP port (587 for TLS, 465 for SSL)
- From address for OTP emails

**File:** `.env` (not committed)

---

## 2. Firebase Production Project Decision

**Why:** The current `firebase-applet-config.json` contains an AI Studio development project (`gen-lang-client-0128430605`). You need to decide whether to use this project in production or create a dedicated one.

**What I need from you:**
- **Option A:** Continue with the existing Firebase project — I will lock down the security rules on this project
- **Option B:** Create a new production Firebase project — you will provide the new config values (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`)
- **Option C:** You will create the project and provide the config

**Impact:** Affects Firestore rules deployment target and API key restrictions.

---

## 3. Deployment Target / Hosting Platform

**Why:** Deployment configuration (Dockerfile, CI/CD, TLS, environment variables) depends on where you plan to host.

**What I need from you — pick one or specify:**
- Google Cloud Run (aligns with current AI Studio setup)
- Firebase Hosting + Cloud Functions
- AWS (EC2, ECS, or Lambda)
- Azure App Service
- Self-hosted VPS
- Other

**Also:**
- Custom domain name (if any)
- TLS/SSL certificate source (Let's Encrypt, Cloud-managed, or org-provided)

---

## 4. Production User Management Strategy

**Why:** Currently all users (farmers, supervisors, admins) authenticate via hardcoded demo credentials. Production needs a real auth strategy.

**What I need from you — decide:**
- **Farmer Authentication:** Which method(s)?
  - [ ] SMS OTP (requires SMS gateway — which provider?)
  - [ ] Email OTP (uses SMTP from item #1)
  - [ ] Aadhaar eKYC API (requires UIDAI partnership — do you have access?)
  - [ ] Firebase Phone Auth (requires Firebase Blaze plan)

- **Staff/Admin Authentication:** Which method(s)?
  - [ ] Firebase Auth with email/password (I can implement)
  - [ ] Organization SSO/LDAP (requires your org identity provider details)
  - [ ] Hardware security tokens / 2FA (requires Authenticator app setup)

---

## 5. Business Rules Confirmation

**Why:** The application contains hardcoded MSP rates, moisture limits, and procurement rules. I need to confirm these are correct for production.

**What I need from you — verify:**
- Are the current MSP rates in `agriMockData.ts` correct for the current procurement season, or should they be fetched from an external source?
- Maximum daily bookings per farmer (currently hardcoded as `3`)
- Appointment grace period (currently `24 hours`) — is this the actual policy?
- APMC regulatory cap on single booking (currently `500 quintals`)
- FAQ moisture threshold for cereals (`12%`) and oilseeds (`10%`)
- Foreign matter threshold (`2%`)

---

## 6. External Integration Priorities

**Why:** The feature registry lists several integrations as "INTEGRATION-READY" with specific government APIs. I need to know which ones you actually intend to connect.

**What I need from you — for each, confirm if you have access or if it's deferred:**

| Integration | Status | Do You Have Access? |
|------------|--------|-------------------|
| PFMS / NPCI DBT Payments | INTEGRATION-READY | Yes / No / Deferred |
| Mahabhulekh (7/12 Land Records) | INTEGRATION-READY | Yes / No / Deferred |
| IMD Mausam Weather API | INTEGRATION-READY | Yes / No / Deferred |
| AIS-140 GPS Fleet Telemetry | INTEGRATION-READY | Yes / No / Deferred |
| C-DAC / Kisan Call Centre IVR | INTEGRATION-READY | Yes / No / Deferred |
| e-NAM Market API | INTEGRATION-READY | Yes / No / Deferred |

---

## 7. Gemini API Key for AI Features

**Why:** The application includes `@google/genai` dependency and `GEMINI_API_KEY` in `.env.example`. The `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`.

**What I need from you:**
- Production Gemini API key (if AI features should be active)
- Or confirmation that AI features are deferred

---

## 8. Data Retention & Privacy Policy

**Why:** The application handles Aadhaar (even last 4 digits), phone numbers, bank account details, and land records — all governed by DPDPA 2023 and UIDAI regulations.

**What I need from you:**
- Nominated Data Protection Officer contact
- Data retention period for farmer profiles
- Data retention period for audit logs
- Data retention period for procurement records
- Whether you need data deletion ("right to be forgotten") capability
- Whether there is an existing privacy policy document to link from the app

## 9. JWT Secret Key

**Why:** The server-side authentication foundation implemented in Phase 2A uses JSON Web Tokens (JWT) to secure API endpoints. A strong, secret key is required to sign and verify these tokens.

**What I need from you:**
- Generate a cryptographically secure random string (at least 32 characters long).
- Set this string as the `JWT_SECRET` environment variable in your production environment.

**Impact:** Without this secret, the server will fail to start and authentication will be broken.

## 10. Firebase Service Account

**Why:** The Phase 2 staff authentication uses `firebase-admin` to securely verify staff login tokens on the server. This requires a Service Account JSON.

**What I need from you:**
- Generate a Firebase Service Account JSON from the Firebase Console (Project Settings > Service Accounts > Generate new private key).
- Stringify the JSON and set it as the `FIREBASE_SERVICE_ACCOUNT` environment variable in your production environment.
- Provision staff users in Firebase Authentication (Email/Password) with exact emails matching those in `SEEDED_STAFF_ADMINS`.

**Impact:** Without this environment variable, staff (Supervisors/Admins) will not be able to log in, though farmer authentication will continue to function.

---

## Summary

| Item | Type | Blocking Phase |
|------|------|---------------|
| SMTP credentials | Credentials | Phase 1 |
| Firebase project decision | Decision | Phase 1 |
| Deployment target | Decision | Phase 7-8 |
| User auth strategy | Decision | Phase 2 |
| JWT Secret Key | Credentials | Phase 2A |
| Firebase Service Account | Credentials | Phase 2 |
| Business rules confirmation | Verification | Phase 5 |
| External integrations | Decision | Post-Phase 8 |
| Gemini API key | Credentials | Post-Phase 8 |
| Data retention policy | Decision | Phase 8 |
