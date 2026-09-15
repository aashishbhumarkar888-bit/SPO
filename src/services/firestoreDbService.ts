import { 
  db, 
  ensureFirebaseAuth, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where,
  serverTimestamp 
} from './firebaseConfig';
import { FarmerProfile, AgriToken } from '../types';
import { 
  CURRENT_FARMER, 
  RAMESH_KUMAR_SIH_DEMO, 
  INITIAL_TOKENS 
} from '../data/agriMockData';
import { SEEDED_DEMO_ACCOUNTS } from './authService';

/**
 * 4 Comprehensive Seeded Farmers with authentic regional land records,
 * Aadhaar last 4, mobile numbers, and bank details.
 */
export const COMPREHENSIVE_SEED_FARMERS: FarmerProfile[] = [
  {
    ...CURRENT_FARMER,
    id: 'FARM-8921',
    kisanId: 'MH-WRD-8921',
    aadhaarLast4: '9082',
    fullName: 'Rameshwar Patil',
    fullNameHi: 'रामेश्वर पाटिल',
    phone: '+91 98224 81920',
    email: 'rameshwar.patil@agriseva.gov.in',
    village: 'Sevagram Khurd',
    villageHi: 'सेवाग्राम खुर्द',
    district: 'Wardha',
    state: 'Maharashtra',
    bankAccount: '•••• •••• 4921',
    bankName: 'State Bank of India (Sevagram Branch)',
    ifsc: 'SBIN0001842',
    pmKisanBeneficiary: true,
  },
  {
    ...RAMESH_KUMAR_SIH_DEMO,
    id: 'FARM-10234',
    kisanId: 'F-10234',
    aadhaarLast4: '4190',
    fullName: 'Ramesh Kumar',
    fullNameHi: 'रमेश कुमार',
    phone: '+91 98102 45890',
    email: 'ramesh.kumar@agriseva.gov.in',
    village: 'Rampur',
    villageHi: 'रामपुर',
    district: 'Wardha',
    state: 'Maharashtra',
    bankAccount: '•••• •••• 6024',
    bankName: 'Punjab National Bank (Rampur Branch)',
    ifsc: 'PUNB0124800',
    pmKisanBeneficiary: true,
  },
  {
    id: 'FARM-9011',
    kisanId: 'MH-WRD-9011',
    aadhaarLast4: '7741',
    fullName: 'Sunita Bai Dhurve',
    fullNameHi: 'सुनीता बाई धुर्वे',
    phone: '+91 97654 32189',
    email: 'sunita.dhurve@agriseva.gov.in',
    village: 'Seloo Tehsil',
    villageHi: 'सेलू तहसील',
    district: 'Wardha',
    state: 'Maharashtra',
    bankAccount: '•••• •••• 7712',
    bankName: 'Bank of Maharashtra (Seloo Branch)',
    ifsc: 'MAHB0000412',
    pmKisanBeneficiary: true,
    landParcels: [
      {
        id: 'PAR-SB-1',
        khasraNumber: '76/1-C',
        areaAcres: 2.8,
        cropSeason: 'Kharif',
        primaryCrop: 'Soyabean (JS-9560)',
        primaryCropHi: 'सोयाबीन (JS-9560)',
        soilHealthCardId: 'SHC-MH-2025-9011',
        irrigationSource: 'Rainfed & Farm Pond'
      }
    ]
  },
  {
    id: 'FARM-4412',
    kisanId: 'MH-WRD-4412',
    aadhaarLast4: '3819',
    fullName: 'Baburao Deshmukh',
    fullNameHi: 'बाबूराव देशमुख',
    phone: '+91 94231 09841',
    email: 'baburao.deshmukh@agriseva.gov.in',
    village: 'Deoli Gram',
    villageHi: 'देवली ग्राम',
    district: 'Wardha',
    state: 'Maharashtra',
    bankAccount: '•••• •••• 3349',
    bankName: 'Canara Bank (Deoli Branch)',
    ifsc: 'CNRB0001928',
    pmKisanBeneficiary: true,
    landParcels: [
      {
        id: 'PAR-BD-1',
        khasraNumber: '112/3',
        areaAcres: 4.5,
        cropSeason: 'Kharif',
        primaryCrop: 'Cotton & Pigeon Pea (Tur)',
        primaryCropHi: 'कपास व अरहर (तूर)',
        soilHealthCardId: 'SHC-MH-2025-4412',
        irrigationSource: 'Borewell Lift'
      }
    ]
  }
];

export interface StaffAdminRecord {
  staffId: string;
  role: 'supervisor' | 'superadmin';
  roleTitle: string;
  fullName: string;
  fullNameHi: string;
  designation: string;
  email: string;
  mobile: string;
  aadhaarMasked: string;
  defaultPasscode: string;
  centreId?: string;
  centreName?: string;
  clearanceLevel: string;
}

export const SEEDED_STAFF_ADMINS: StaffAdminRecord[] = [
  {
    staffId: 'SUP-WRD-01',
    role: 'supervisor',
    roleTitle: 'Mandi Yard Kendra Supervisor',
    fullName: 'Dnyaneshwar S. Kulkarni',
    fullNameHi: 'ज्ञानेश्वर एस. कुलकर्णी',
    designation: 'Mandi Board Field Officer & Weighbridge Supervisor',
    email: 'supervisor.wardha@agriseva.gov.in',
    mobile: '9422156789',
    aadhaarMasked: 'XXXX XXXX 1098',
    defaultPasscode: '1234',
    centreId: 'CEN-1',
    centreName: 'Wardha Central APMC Mandi Yard',
    clearanceLevel: 'LEVEL-2_MANDI_SUPERVISOR'
  },
  {
    staffId: 'SUP-WRD-02',
    role: 'supervisor',
    roleTitle: 'Procurement Sub-Centre Supervisor',
    fullName: 'Sunil Meshram',
    fullNameHi: 'सुनील मेश्राम',
    designation: 'Field Inspection & Moisture In-Charge',
    email: 'sunil.meshram@agriseva.gov.in',
    mobile: '9422987654',
    aadhaarMasked: 'XXXX XXXX 3321',
    defaultPasscode: '1234',
    centreId: 'CEN-2',
    centreName: 'Sevagram Procurement Sub-Centre',
    clearanceLevel: 'LEVEL-2_MANDI_SUPERVISOR'
  },
  {
    staffId: 'ADMIN-MH-STATE-01',
    role: 'superadmin',
    roleTitle: 'State Policy Authority & Mandi Commissioner',
    fullName: 'Sanjay V. Deshmukh, IAS',
    fullNameHi: 'संजय व्ही. देशमुख, आईएएस',
    designation: 'Principal Secretary & State Mandi Board Commissioner',
    email: 'admin.msamb@agriseva.gov.in',
    mobile: '9811002233',
    aadhaarMasked: 'XXXX XXXX 0987',
    defaultPasscode: 'admin2026',
    clearanceLevel: 'LEVEL-4_STATE_GOVERNANCE'
  }
];

let isInitialized = false;

/**
 * Ensures Firestore database collections (farmers, staff_users, tokens) 
 * are properly initialized with the 4 farmers and admin records.
 */
export async function initializeFirestoreData(): Promise<boolean> {
  if (isInitialized) return true;

  try {
    await ensureFirebaseAuth();

    // 1. Seed Farmers if not present
    const farmersCol = collection(db, 'farmers');
    const existingFarmersSnap = await getDocs(farmersCol);

    if (existingFarmersSnap.empty) {
      console.log('[Firestore] Seeding 4 default farmers into Firestore...');
      for (const farmer of COMPREHENSIVE_SEED_FARMERS) {
        await setDoc(doc(db, 'farmers', farmer.id), {
          ...farmer,
          createdAt: new Date().toISOString()
        });
      }
    }

    // 2. Seed Staff and Admins
    const staffCol = collection(db, 'staff_users');
    const existingStaffSnap = await getDocs(staffCol);

    if (existingStaffSnap.empty) {
      console.log('[Firestore] Seeding admin and supervisor credentials into Firestore...');
      for (const staff of SEEDED_STAFF_ADMINS) {
        await setDoc(doc(db, 'staff_users', staff.staffId), {
          ...staff,
          createdAt: new Date().toISOString()
        });
      }
    }

    // 3. Seed initial tokens if empty
    const tokensCol = collection(db, 'tokens');
    const existingTokensSnap = await getDocs(tokensCol);

    if (existingTokensSnap.empty) {
      console.log('[Firestore] Seeding initial mandi tokens into Firestore...');
      for (const token of INITIAL_TOKENS) {
        await setDoc(doc(db, 'tokens', token.id), {
          ...token,
          createdAt: new Date().toISOString()
        });
      }
    }

    isInitialized = true;
    return true;
  } catch (error) {
    console.warn('[Firestore] Initialization fallback to local store:', error);
    // Even if Firestore fails (e.g., offline or permission block), app continues smoothly
    isInitialized = true;
    return false;
  }
}

/**
 * Searches and retrieves a farmer by phone, 12-digit Aadhaar, or email from Firestore.
 */
export async function getFarmerByIdentifierFromFirestore(
  type: 'mobile' | 'aadhaar' | 'email',
  cleanValue: string
): Promise<FarmerProfile | null> {
  try {
    await ensureFirebaseAuth();
    const farmersCol = collection(db, 'farmers');
    const snapshot = await getDocs(farmersCol);

    if (!snapshot.empty) {
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as FarmerProfile;
        if (type === 'mobile') {
          const storedPhoneDigits = (data.phone || '').replace(/\D/g, '');
          if (storedPhoneDigits.endsWith(cleanValue) || cleanValue.endsWith(storedPhoneDigits)) {
            return data;
          }
        } else if (type === 'aadhaar') {
          // Compare last 4 digits
          const cleanLast4 = cleanValue.slice(-4);
          if (data.aadhaarLast4 === cleanLast4) {
            return data;
          }
        } else if (type === 'email') {
          if ((data.email || '').toLowerCase() === cleanValue.toLowerCase()) {
            return data;
          }
        }
      }
    }
  } catch (error) {
    console.warn('[Firestore] Query error, checking in-memory cache:', error);
  }

  // Fallback to in-memory comprehensive seed farmers
  for (const farmer of COMPREHENSIVE_SEED_FARMERS) {
    if (type === 'mobile') {
      const storedDigits = farmer.phone.replace(/\D/g, '');
      if (storedDigits.endsWith(cleanValue) || cleanValue.endsWith(storedDigits)) {
        return farmer;
      }
    } else if (type === 'aadhaar') {
      if (farmer.aadhaarLast4 === cleanValue.slice(-4)) {
        return farmer;
      }
    } else if (type === 'email') {
      if ((farmer.email || '').toLowerCase() === cleanValue.toLowerCase()) {
        return farmer;
      }
    }
  }

  return null;
}

/**
 * Saves or updates a farmer profile in Firestore.
 */
export async function saveFarmerToFirestore(farmer: FarmerProfile): Promise<boolean> {
  try {
    await ensureFirebaseAuth();
    await setDoc(doc(db, 'farmers', farmer.id), {
      ...farmer,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firestore] Failed to persist farmer:', error);
    return false;
  }
}

/**
 * Saves a newly booked token to Firestore.
 */
export async function saveTokenToFirestore(token: AgriToken): Promise<boolean> {
  try {
    await ensureFirebaseAuth();
    await setDoc(doc(db, 'tokens', token.id), {
      ...token,
      createdAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firestore] Failed to persist token:', error);
    return false;
  }
}
