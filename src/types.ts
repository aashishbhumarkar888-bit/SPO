export type RoleMode = 'farmer' | 'supervisor' | 'superadmin';
export type AppRole = RoleMode;

export type IntegrationStatusBadge = 'LIVE' | 'SYNCED' | 'INTEGRATION-READY' | 'PROPOSED';

export interface DataFlowSpec {
  input: string;
  processing: string;
  output: string;
}

export interface IntegrationAuditItem {
  id: string;
  featureName: string;
  subsystem: 'Kisan Mitra' | 'Command Center' | 'Super Admin Governance';
  status: IntegrationStatusBadge;
  badgeTag: string; // e.g., "Client Algorithm", "IMD Mausam", "Offline Available"
  currentPrototype: string;
  productionIntegration: string;
  dataFlow: DataFlowSpec;
  authentication: string;
  offlineBehaviour: string;
  failureHandling: string;
  security: string;
  judgeFaq: {
    question: string;
    answer: string;
  };
}

export type LanguageCode = 'hi' | 'en' | 'mr' | 'pa';

export interface TranslationDict {
  appName: string;
  tagline: string;
  switchRole: string;
  farmerTitle: string;
  supervisorTitle: string;
  superAdminTitle: string;
  greeting: string;
  kisanId: string;
  activeToken: string;
  bookService: string;
  mandiPass: string;
  machineryHire: string;
  soilTesting: string;
  fertiliserQuota: string;
  liveQueue: string;
  procurementJourney: string;
  dbtPayments: string;
  centresDirections: string;
  profileLand: string;
  kisanMitraVoice: string;
  helpline: string;
  offlineMode: string;
  weatherSunny: string;
}

export type QueueStatus = 
  | 'Waiting' 
  | 'Called' 
  | 'At Counter' 
  | 'Quality Check' 
  | 'Weighbridge' 
  | 'DBT Released' 
  | 'Completed' 
  | 'Cancelled';

export type ServiceType = 'Machinery' | 'MandiSlot' | 'SoilTest' | 'Fertiliser';

export interface FarmerProfile {
  id: string;
  kisanId: string; // e.g. "MH-WRD-8921"
  aadhaarLast4: string;
  fullName: string;
  fullNameHi: string;
  phone: string;
  village: string;
  villageHi: string;
  district: string;
  state: string;
  bankAccount: string;
  bankName: string;
  ifsc: string;
  landParcels: LandParcel[];
  pmKisanBeneficiary: boolean;
}

export interface LandParcel {
  id: string;
  khasraNumber: string; // e.g. "44/2-A"
  areaAcres: number;
  cropSeason: 'Kharif' | 'Rabi' | 'Zaid';
  primaryCrop: string;
  primaryCropHi: string;
  soilHealthCardId: string;
  irrigationSource: string;
}

export interface ServiceCentre {
  id: string;
  name: string;
  nameHi: string;
  type: 'AgriSeva Kendra' | 'APMC Mandi Yard' | 'Custom Hiring Hub';
  villageOrTown: string;
  district: string;
  distanceKm: number;
  lat: number;
  lng: number;
  phone: string;
  operatingHours: string;
  currentQueueCount: number;
  avgWaitTimeMins: number;
  servicesAvailable: ServiceType[];
}

export interface ServiceSlot {
  id: string;
  centreId: string;
  date: string;
  timeRange: string;
  isRecommended: boolean;
  recommendationReason?: string;
  recommendationReasonHi?: string;
  congestion: 'Low' | 'Moderate' | 'Heavy';
  availableSpots: number;
}

export interface AgriToken {
  id: string;
  tokenNumber: string; // e.g. "AS-108"
  farmerId: string;
  farmerName: string;
  farmerNameHi: string;
  farmerPhone: string;
  kisanId: string;
  serviceType: ServiceType;
  centreId: string;
  centreName: string;
  centreNameHi: string;
  scheduledTime: string;
  counterAssigned: number;
  status: QueueStatus;
  estimatedWaitMins: number;
  peopleAhead: number;
  priority: boolean;
  issueTimestamp: string;
  qrCodeValue: string;
  // Specific service details
  serviceDetails: {
    cropName?: string;
    cropNameHi?: string;
    approxQuintals?: number;
    machineryType?: string;
    acreage?: number;
    fertiliserBags?: number;
  };
}

export interface ProcurementRecord {
  id: string;
  tokenId: string;
  slipNumber: string; // e.g. "MND-2026-904"
  farmerName: string;
  farmerNameHi: string;
  kisanId: string;
  cropName: string;
  cropNameHi: string;
  grossWeightQuintals: number;
  tareWeightQuintals: number;
  netWeightQuintals: number;
  moisturePercentage: number;
  foreignMatterPercentage: number;
  qualityGrade: 'FAQ Grade A' | 'Grade B' | 'Below Fair';
  mspPerQuintal: number;
  totalGrossPayable: number;
  dbtStatus: 'Pending Verification' | 'Advice Generated' | 'Transferred' | 'Disputed';
  utrNumber?: string;
  timestamp: string;
}

export interface MachineryAsset {
  id: string;
  code: string;
  registrationNumber: string;
  name: string;
  nameHi: string;
  category: 'Tractor' | 'Combine Harvester' | 'Rotavator' | 'Garuda Drone Sprayer';
  capacityOrHp: string;
  hourlyRentalInr: number;
  status: 'Available' | 'Dispatched' | 'In-Field' | 'Maintenance';
  fuelBatteryLevel: number;
  assignedFarmer?: string;
  assignedVillage?: string;
  acresCoveredToday: number;
  operatorName: string;
  operatorPhone: string;
  lat: number;
  lng: number;
}

export interface DbtTransaction {
  id: string;
  utrNumber: string;
  date: string;
  scheme: string; // e.g. "MSP Procurement Payout", "PM-Kisan 17th Installment", "Sub-Mission on Agri Mechanization"
  amountInr: number;
  status: 'Credited' | 'Processing' | 'Held for Audit';
  bankMasked: string;
  description: string;
  descriptionHi: string;
}

export interface BusinessRuleConfig {
  mspRates: {
    crop: string;
    msp: number;
    maxMoistureFAQ: number;
    deductionPerMoisturePoint: number;
  }[];
  subsidyDiscountPctSmallFarmers: number;
  maxDailyBookingsPerFarmer: number;
  queuePacingPerHour: number;
  autoCallIntervalMins: number;
  alertEmergencyBroadcast: string;
  alertEmergencyBroadcastHi: string;
}
