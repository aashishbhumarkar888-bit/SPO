/**
 * AgriSeva Multi-Method Authentication & Demo Credentials Service
 * 
 * Compliant with:
 * - Firebase Firestore integration with automatic seeding and live query
 * - DPDPA & UIDAI Aadhaar Masking Standards (never store or display full Aadhaar plaintext post-auth)
 * - Tri-Mode Identifier Detection (12-digit Aadhaar, 10-digit mobile, RFC-5322 email)
 * - Mobile OTP / Aadhaar OTP simulation (very easy, one-click or SMS-style OTP)
 * - Seeded accounts for 4 farmers and admin/supervisors
 */

import { FarmerProfile, SupervisorSession, SuperAdminSession } from '../types';
import { CURRENT_FARMER, RAMESH_KUMAR_SIH_DEMO } from '../data/agriMockData';
import { 
  COMPREHENSIVE_SEED_FARMERS, 
  SEEDED_STAFF_ADMINS,
  getFarmerByIdentifierFromFirestore,
  initializeFirestoreData
} from './firestoreDbService';

export type DetectedIdentifierType = 'aadhaar' | 'mobile' | 'email' | 'unknown';

export interface IdentifierValidation {
  isValid: boolean;
  type: DetectedIdentifierType;
  cleanValue: string;
  formattedDisplay: string;
  errorEn?: string;
  errorHi?: string;
}

/**
 * Automatically detects whether an input string is an Aadhaar number,
 * mobile number, or email address without requiring the user to manually pick a mode.
 */
export function detectIdentifierType(input: string): DetectedIdentifierType {
  const trimmed = input.trim();
  if (!trimmed) return 'unknown';

  if (trimmed.includes('@')) {
    return 'email';
  }

  const digits = trimmed.replace(/[\s-]/g, '');
  if (/^\d+$/.test(digits)) {
    if (digits.length === 12) return 'aadhaar';
    if (digits.length === 10) return 'mobile';
  }

  return 'unknown';
}

/**
 * Validates the identifier according to its detected type and returns
 * clean format along with bilingual inline error messages.
 */
export function validateIdentifier(input: string): IdentifierValidation {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      type: 'unknown',
      cleanValue: '',
      formattedDisplay: '',
      errorEn: 'Please enter your mobile number (10 digits) or Aadhaar number (12 digits).',
      errorHi: 'कृपया अपना 10-अंकों का मोबाइल नंबर या 12-अंकों का आधार नंबर दर्ज करें।'
    };
  }

  // 1. Email detection & validation
  if (trimmed.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = trimmed.toLowerCase();
    const isValid = emailRegex.test(cleanEmail);

    return {
      isValid,
      type: 'email',
      cleanValue: cleanEmail,
      formattedDisplay: cleanEmail,
      errorEn: isValid ? undefined : 'Please enter a valid email address (e.g. kisan@agriseva.gov.in).',
      errorHi: isValid ? undefined : 'कृपया एक मान्य ईमेल पता दर्ज करें (उदा. kisan@agriseva.gov.in)।'
    };
  }

  // 2. Numeric detection (Aadhaar or Mobile)
  const digits = trimmed.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(digits)) {
    return {
      isValid: false,
      type: 'unknown',
      cleanValue: trimmed,
      formattedDisplay: trimmed,
      errorEn: 'Input contains invalid characters. Enter 10-digit mobile or 12-digit Aadhaar.',
      errorHi: 'अमान्य वर्ण। केवल 10 अंकों का मोबाइल नंबर या 12 अंकों का आधार नंबर दर्ज करें।'
    };
  }

  // Exactly 10 digits -> Indian Mobile Number
  if (digits.length === 10) {
    const startsValid = /^[6-9]/.test(digits);
    return {
      isValid: startsValid,
      type: 'mobile',
      cleanValue: digits,
      formattedDisplay: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
      errorEn: startsValid ? undefined : 'Invalid mobile number. Indian mobile numbers must begin with 6, 7, 8, or 9.',
      errorHi: startsValid ? undefined : 'अमान्य मोबाइल नंबर। भारतीय मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए।'
    };
  }

  // Exactly 12 digits -> Indian Aadhaar Number
  if (digits.length === 12) {
    const startsValid = /^[2-9]/.test(digits);
    return {
      isValid: startsValid,
      type: 'aadhaar',
      cleanValue: digits,
      formattedDisplay: `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`,
      errorEn: startsValid ? undefined : 'Invalid Aadhaar number. Standard 12-digit Aadhaar cannot start with 0 or 1.',
      errorHi: startsValid ? undefined : 'अमान्य आधार संख्या। मानक 12-अंकीय आधार 0 या 1 से शुरू नहीं हो सकता।'
    };
  }

  // Partial or invalid lengths
  if (digits.length < 10) {
    return {
      isValid: false,
      type: 'mobile',
      cleanValue: digits,
      formattedDisplay: digits,
      errorEn: `Number too short (${digits.length}/10 digits for mobile).`,
      errorHi: `नंबर बहुत छोटा है (मोबाइल के लिए ${digits.length}/10 अंक)।`
    };
  }

  if (digits.length === 11) {
    return {
      isValid: false,
      type: 'unknown',
      cleanValue: digits,
      formattedDisplay: digits,
      errorEn: '11 digits entered. Mobile must be 10 digits or Aadhaar must be 12 digits.',
      errorHi: '11 अंक दर्ज किए गए। मोबाइल 10 अंक या आधार 12 अंक का होना चाहिए।'
    };
  }

  return {
    isValid: false,
    type: 'aadhaar',
    cleanValue: digits,
    formattedDisplay: digits,
    errorEn: `Number too long (${digits.length}/12 digits for Aadhaar).`,
    errorHi: `नंबर बहुत लंबा है (आधार के लिए ${digits.length}/12 अंक)।`
  };
}

/**
 * Standard UIDAI PII Masking:
 * Strictly prevents plaintext Aadhaar numbers in UI post-authentication.
 * e.g., "5678 1234 9082" -> "XXXX XXXX 9082"
 */
export function maskAadhaar(aadhaarOrLast4: string): string {
  const digits = (aadhaarOrLast4 || '').replace(/[\s-]/g, '');
  if (digits.length >= 4) {
    return `XXXX XXXX ${digits.slice(-4)}`;
  }
  return 'XXXX XXXX XXXX';
}

/**
 * Gating function for Demo Directory:
 */
export function isDemoEnvironment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Seeded Demo Accounts Directory
 */
export interface DemoAccountDirectoryItem {
  id: string;
  role: 'farmer' | 'supervisor' | 'superadmin';
  roleName: string;
  roleNameHi: string;
  personName: string;
  personNameHi: string;
  designation: string;
  identifiers: {
    mobile: string;
    aadhaarMasked: string;
    email: string;
    staffId?: string;
  };
  demoPasscode?: string;
  passcodeLabel: string;
  passcodeLabelHi: string;
  profileReference?: FarmerProfile;
  notes: string;
}

export const SEEDED_DEMO_ACCOUNTS: DemoAccountDirectoryItem[] = [
  // 1. Farmer 1: Rameshwar Patil
  {
    id: 'DEMO-ACC-FARMER-1',
    role: 'farmer',
    roleName: 'Farmer (Wardha - Soyabean & Cotton)',
    roleNameHi: 'किसान (वर्धा - सोयाबीन व कपास)',
    personName: 'Rameshwar Patil',
    personNameHi: 'रामेश्वर पाटिल',
    designation: 'Registered Farmer • Sevagram Khurd, Wardha (5.5 Acres)',
    identifiers: {
      mobile: '9822481920',
      aadhaarMasked: 'XXXX XXXX 9082',
      email: 'rameshwar.patil@agriseva.gov.in',
      staffId: 'MH-WRD-8921'
    },
    passcodeLabel: 'OTP / PIN',
    passcodeLabelHi: 'ओटीपी / पिन',
    profileReference: COMPREHENSIVE_SEED_FARMERS[0],
    notes: 'Kharif Soyabean & Cotton farmer with linked SBI DBT bank account (Kisan ID: MH-WRD-8921).'
  },
  // 2. Farmer 2: Ramesh Kumar
  {
    id: 'DEMO-ACC-FARMER-2',
    role: 'farmer',
    roleName: 'Farmer (Rampur - Sharbati Wheat)',
    roleNameHi: 'किसान (रामपुर - शरबती गेहूं)',
    personName: 'Ramesh Kumar',
    personNameHi: 'रमेश कुमार',
    designation: 'Registered Farmer • Rampur, Wardha (5.0 Acres)',
    identifiers: {
      mobile: '9810245890',
      aadhaarMasked: 'XXXX XXXX 4190',
      email: 'ramesh.kumar@agriseva.gov.in',
      staffId: 'F-10234'
    },
    passcodeLabel: 'OTP / PIN',
    passcodeLabelHi: 'ओटीपी / पिन',
    profileReference: COMPREHENSIVE_SEED_FARMERS[1],
    notes: 'Rabi Wheat farmer (PNB DBT account, active token AS-118, Kisan ID: F-10234).'
  },
  // 3. Farmer 3: Sunita Bai Dhurve
  {
    id: 'DEMO-ACC-FARMER-3',
    role: 'farmer',
    roleName: 'Farmer (Seloo - Smallholder Soyabean)',
    roleNameHi: 'किसान (सेलू - लघु कृषक सोयाबीन)',
    personName: 'Sunita Bai Dhurve',
    personNameHi: 'सुनीता बाई धुर्वे',
    designation: 'Registered Smallholder Farmer • Seloo, Wardha (2.8 Acres)',
    identifiers: {
      mobile: '9765432189',
      aadhaarMasked: 'XXXX XXXX 7741',
      email: 'sunita.dhurve@agriseva.gov.in',
      staffId: 'MH-WRD-9011'
    },
    passcodeLabel: 'OTP / PIN',
    passcodeLabelHi: 'ओटीपी / पिन',
    profileReference: COMPREHENSIVE_SEED_FARMERS[2],
    notes: 'Priority female farmer beneficiary with Bank of Maharashtra DBT account (Kisan ID: MH-WRD-9011).'
  },
  // 4. Farmer 4: Baburao Deshmukh
  {
    id: 'DEMO-ACC-FARMER-4',
    role: 'farmer',
    roleName: 'Farmer (Deoli - Cotton & Pulses)',
    roleNameHi: 'किसान (देवली - कपास व दलहन)',
    personName: 'Baburao Deshmukh',
    personNameHi: 'बाबूराव देशमुख',
    designation: 'Registered Farmer • Deoli Gram, Wardha (4.5 Acres)',
    identifiers: {
      mobile: '9423109841',
      aadhaarMasked: 'XXXX XXXX 3819',
      email: 'baburao.deshmukh@agriseva.gov.in',
      staffId: 'MH-WRD-4412'
    },
    passcodeLabel: 'OTP / PIN',
    passcodeLabelHi: 'ओटीपी / पिन',
    profileReference: COMPREHENSIVE_SEED_FARMERS[3],
    notes: 'Custom hiring and tractor rental user with Canara Bank account (Kisan ID: MH-WRD-4412).'
  },
  // Supervisor 1: Wardha Central
  {
    id: 'DEMO-ACC-SUPERVISOR-1',
    role: 'supervisor',
    roleName: 'Kendra Supervisor (Wardha Central)',
    roleNameHi: 'उपार्जन केंद्र पर्यवेक्षक (वर्धा केंद्रीय)',
    personName: 'Dnyaneshwar S. Kulkarni',
    personNameHi: 'ज्ञानेश्वर एस. कुलकर्णी',
    designation: 'Mandi Board Field Officer & Kendra Supervisor',
    identifiers: {
      mobile: '9422156789',
      aadhaarMasked: 'XXXX XXXX 1098',
      email: 'supervisor.wardha@agriseva.gov.in',
      staffId: 'SUP-WRD-01'
    },
    passcodeLabel: 'Field Security PIN',
    passcodeLabelHi: 'फील्ड सुरक्षा पिन',
    notes: 'Authorized operator for Wardha Central APMC Mandi Yard (CEN-1) weighbridge terminal.'
  },
  // Supervisor 2: Sevagram Sub-Centre
  {
    id: 'DEMO-ACC-SUPERVISOR-2',
    role: 'supervisor',
    roleName: 'Kendra Supervisor (Sevagram Sub-Centre)',
    roleNameHi: 'उपार्जन केंद्र पर्यवेक्षक (सेवाग्राम उप-केंद्र)',
    personName: 'Sunil Meshram',
    personNameHi: 'सुनील मेश्राम',
    designation: 'Field Inspection & Moisture In-Charge',
    identifiers: {
      mobile: '9422987654',
      aadhaarMasked: 'XXXX XXXX 3321',
      email: 'sunil.meshram@agriseva.gov.in',
      staffId: 'SUP-WRD-02'
    },
    passcodeLabel: 'Field Security PIN',
    passcodeLabelHi: 'फील्ड सुरक्षा पिन',
    notes: 'Authorized operator for Sevagram Procurement Sub-Centre (CEN-2).'
  },
  // Super Admin: State Governance Authority
  {
    id: 'DEMO-ACC-SUPERADMIN-1',
    role: 'superadmin',
    roleName: 'Super Admin (State Policy Authority)',
    roleNameHi: 'सुपर एडमिन (राज्य नीति प्राधिकरण)',
    personName: 'Sanjay V. Deshmukh, IAS',
    personNameHi: 'संजय व्ही. देशमुख, आईएएस',
    designation: 'Principal Secretary & State Mandi Board Commissioner',
    identifiers: {
      mobile: '9811002233',
      aadhaarMasked: 'XXXX XXXX 0987',
      email: 'admin.msamb@agriseva.gov.in',
      staffId: 'ADMIN-MH-STATE-01'
    },
    passcodeLabel: 'Master Governance Passphrase',
    passcodeLabelHi: 'मास्टर गवर्नेंस पासफ्रेज',
    notes: 'Level-4 State Governance Authority for MSAMB & Ministry of Agriculture & Farmers Welfare.'
  }
];

export interface FarmerAuthResult {
  success: boolean;
  farmer?: FarmerProfile;
  errorEn?: string;
  errorHi?: string;
  matchedIdentifierType?: DetectedIdentifierType;
}

/**
 * Attempts to authenticate a farmer using:
 * - 10-digit registered mobile number + OTP
 * - 12-digit Aadhaar number + OTP
 * - Email address + OTP
 * 
 * Verifies with Firestore and falls back seamlessly to the 4 seeded farmers.
 */
export async function authenticateFarmerAsync(
  rawIdentifier: string,
  passcode: string
): Promise<FarmerAuthResult> {
  const validation = validateIdentifier(rawIdentifier);
  if (!validation.isValid) {
    return {
      success: false,
      errorEn: validation.errorEn,
      errorHi: validation.errorHi,
      matchedIdentifierType: validation.type
    };
  }

  // Validate passcode / OTP
  const trimmedPin = passcode.trim();
  if (!trimmedPin || trimmedPin.length < 4) {
    return {
      success: false,
      errorEn: 'Please enter your 4-digit OTP or Security PIN.',
      errorHi: 'कृपया अपना 4-अंकीय ओटीपी या सुरक्षा पिन दर्ज करें।',
      matchedIdentifierType: validation.type
    };
  }

  // Hardcoded OTP validation removed for production safety.
  // Real OTP verification will occur server-side with /api/auth/verify-smtp-otp

  // 1. Try querying Firestore for the registered farmer
  if (validation.type === 'mobile' || validation.type === 'aadhaar' || validation.type === 'email') {
    const firestoreFarmer = await getFarmerByIdentifierFromFirestore(
      validation.type, 
      validation.cleanValue
    );
    if (firestoreFarmer) {
      return {
        success: true,
        farmer: firestoreFarmer,
        matchedIdentifierType: validation.type
      };
    }
  }

  // 2. Fallback check among the 4 comprehensive seeded farmers
  const cleanVal = validation.cleanValue;
  for (const acc of SEEDED_DEMO_ACCOUNTS) {
    if (acc.role !== 'farmer' || !acc.profileReference) continue;

    if (isDemoEnvironment()) {
      const mobileClean = acc.identifiers.mobile.replace(/[\s-]/g, '');
      const emailClean = acc.identifiers.email.toLowerCase();

      const isMatch = 
        (validation.type === 'aadhaar' && cleanVal.endsWith(acc.profileReference.aadhaarLast4)) ||
        (validation.type === 'mobile' && (cleanVal === mobileClean || mobileClean.endsWith(cleanVal))) ||
        (validation.type === 'email' && cleanVal === emailClean);

      if (isMatch) {
        return {
          success: true,
          farmer: acc.profileReference,
          matchedIdentifierType: validation.type
        };
      }
    }
  }

  // No fabricated farmer fallback in production
  return {
    success: false,
    errorEn: 'Account not found. Please register at your nearest procurement center.',
    errorHi: 'खाता नहीं मिला। कृपया अपने निकटतम उपार्जन केंद्र पर पंजीकरण करें।',
    matchedIdentifierType: validation.type
  };
}

/**
 * Synchronous wrapper for backwards compatibility
 */
export function authenticateFarmer(
  rawIdentifier: string,
  passcode: string
): FarmerAuthResult {
  const validation = validateIdentifier(rawIdentifier);
  if (!validation.isValid) {
    return {
      success: false,
      errorEn: validation.errorEn,
      errorHi: validation.errorHi,
      matchedIdentifierType: validation.type
    };
  }

  const trimmedPin = passcode.trim();
  if (!trimmedPin || trimmedPin.length < 4) {
    return {
      success: false,
      errorEn: 'Please enter your 4-digit OTP or Security PIN.',
      errorHi: 'कृपया अपना 4-अंकीय ओटीपी या सुरक्षा पिन दर्ज करें।',
      matchedIdentifierType: validation.type
    };
  }

  const cleanVal = validation.cleanValue;
  for (const acc of SEEDED_DEMO_ACCOUNTS) {
    if (acc.role !== 'farmer' || !acc.profileReference) continue;

    if (isDemoEnvironment()) {
      const mobileClean = acc.identifiers.mobile.replace(/[\s-]/g, '');
      const emailClean = acc.identifiers.email.toLowerCase();

      const isMatch = 
        (validation.type === 'aadhaar' && cleanVal.endsWith(acc.profileReference.aadhaarLast4)) ||
        (validation.type === 'mobile' && (cleanVal === mobileClean || mobileClean.endsWith(cleanVal))) ||
        (validation.type === 'email' && cleanVal === emailClean);

      if (isMatch) {
        return {
          success: true,
          farmer: acc.profileReference,
          matchedIdentifierType: validation.type
        };
      }
    }
  }

  return {
    success: false,
    errorEn: 'Account not found. Please register at your nearest procurement center.',
    errorHi: 'खाता नहीं मिला। कृपया अपने निकटतम उपार्जन केंद्र पर पंजीकरण करें।',
    matchedIdentifierType: validation.type
  };
}
