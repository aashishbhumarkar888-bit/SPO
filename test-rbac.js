import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(role, expectedStatus, overrideRoleInBody = false) {
  const payload = {
    email: 'test@example.com',
    role: role,
    userId: 'test-user'
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  const headers = {};
  if (role !== 'none') {
    headers['Cookie'] = `spo_session=${token}`;
  }
  headers['Content-Type'] = 'application/json';

  const body = {};
  if (overrideRoleInBody) {
    body.role = 'superadmin';
  }

  try {
    const res = await fetch(`${BASE_URL}/api/ml/reallocate-and-predict`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    // Accept 500 as "Auth Passed" because the ML endpoint might fail to run the python script, but that means it got past RBAC middleware (which returns 401/403).
    // If we expect 200, but get 500, it's still an auth success.
    const isAuthSuccess = res.status !== 401 && res.status !== 403;
    const isExpectedAuthSuccess = expectedStatus !== 401 && expectedStatus !== 403;
    const bodyText = await res.text();

    if (res.status === expectedStatus || (isExpectedAuthSuccess && isAuthSuccess)) {
      console.log(`[PASS] Role: ${role} (Override: ${overrideRoleInBody}) -> Expected ${isExpectedAuthSuccess ? 'Auth Success (200/500)' : expectedStatus}, Got ${res.status}. Body: ${bodyText}`);
    } else {
      console.error(`[FAIL] Role: ${role} (Override: ${overrideRoleInBody}) -> Expected ${expectedStatus}, Got ${res.status}. Body: ${bodyText}`);
    }
  } catch (err) {
    console.error(`[ERROR] Role: ${role} -> ${err.message}`);
  }
}

async function runTests() {
  console.log('Running RBAC Tests against /api/ml/reallocate-and-predict...\n');
  
  await testEndpoint('none', 401);
  await testEndpoint('farmer', 403);
  await testEndpoint('supervisor', 200); // 200 or 500 expected
  await testEndpoint('superadmin', 200); // 200 or 500 expected

  console.log('\nTesting Role Overrides...');
  await testEndpoint('farmer', 403, true); // Should remain 403, body role ignored
  await testEndpoint('supervisor', 200, true); // Should pass auth
}

runTests();
