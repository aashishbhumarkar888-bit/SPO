import { 
  FarmerProfile, 
  ServiceCentre, 
  ServiceSlot, 
  AgriToken, 
  ProcurementRecord, 
  MachineryAsset, 
  DbtTransaction, 
  BusinessRuleConfig,
  LanguageCode,
  TranslationDict,
  IntegrationAuditItem
} from '../types';

export const RAMESH_KUMAR_SIH_DEMO: FarmerProfile = {
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
  landParcels: [
    {
      id: 'PAR-RK-1',
      khasraNumber: '108/4',
      areaAcres: 5.0,
      cropSeason: 'Rabi',
      primaryCrop: 'Wheat (Sharbati HD-2967)',
      primaryCropHi: 'गेहूं (शरबती HD-2967)',
      soilHealthCardId: 'SHC-MH-2026-10234',
      irrigationSource: 'Canal & Tube Well'
    }
  ]
};

export const RAMESH_KUMAR_DEMO_TOKEN: AgriToken = {
  id: 'TOK-RK-10234',
  tokenNumber: 'AS-118',
  farmerId: 'FARM-10234',
  farmerName: 'Ramesh Kumar',
  farmerNameHi: 'रमेश कुमार',
  farmerPhone: '+91 98102 45890',
  kisanId: 'F-10234',
  serviceType: 'MandiSlot',
  centreId: 'CEN-A',
  centreName: 'Procurement Centre A',
  centreNameHi: 'उपार्जन केंद्र ए (Procurement Centre A)',
  scheduledTime: 'Today, 10:30 AM',
  counterAssigned: 2,
  status: 'Waiting',
  estimatedWaitMins: 18,
  peopleAhead: 10,
  priority: false,
  issueTimestamp: 'Today, 10:00 AM',
  qrCodeValue: 'AGRISEVA-TOKEN-AS-118-F-10234-RAMESH-KUMAR',
  serviceDetails: {
    cropName: 'Wheat (Sharbati)',
    cropNameHi: 'गेहूं (शरबती)',
    approxQuintals: 80
  }
};

export const CURRENT_FARMER: FarmerProfile = {
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
  landParcels: [
    {
      id: 'PAR-1',
      khasraNumber: '44/2-A',
      areaAcres: 3.5,
      cropSeason: 'Kharif',
      primaryCrop: 'Soyabean (JS-335)',
      primaryCropHi: 'सोयाबीन (JS-335)',
      soilHealthCardId: 'SHC-MH-2025-0982',
      irrigationSource: 'Borewell & Drip Line'
    },
    {
      id: 'PAR-2',
      khasraNumber: '12/B',
      areaAcres: 2.0,
      cropSeason: 'Kharif',
      primaryCrop: 'Cotton (Bt Hybrid)',
      primaryCropHi: 'कपास (Bt संकर)',
      soilHealthCardId: 'SHC-MH-2025-0983',
      irrigationSource: 'Canal Lift'
    }
  ]
};

export const FARMER_REGISTRY: FarmerProfile[] = [
  CURRENT_FARMER,
  RAMESH_KUMAR_SIH_DEMO
];

export const SERVICE_CENTRES: ServiceCentre[] = [
  {
    id: 'CEN-A',
    name: 'Procurement Centre A',
    nameHi: 'उपार्जन केंद्र ए (Wardha Mandi Yard)',
    type: 'APMC Mandi Yard',
    villageOrTown: 'Rampur Sub-Yard, Wardha',
    district: 'Wardha',
    distanceKm: 2.4,
    lat: 20.7350,
    lng: 78.6100,
    phone: '07152-241020',
    operatingHours: '08:00 AM - 06:00 PM',
    currentQueueCount: 18,
    avgWaitTimeMins: 18,
    servicesAvailable: ['MandiSlot']
  },
  {
    id: 'CEN-1',
    name: 'Wardha Central AgriSeva Kendra',
    nameHi: 'वर्धा केंद्रीय कृषि सेवा केंद्र',
    type: 'AgriSeva Kendra',
    villageOrTown: 'Civil Lines, Wardha',
    district: 'Wardha',
    distanceKm: 3.8,
    lat: 20.7453,
    lng: 78.6022,
    phone: '07152-245100',
    operatingHours: '07:00 AM - 07:00 PM',
    currentQueueCount: 6,
    avgWaitTimeMins: 18,
    servicesAvailable: ['Machinery', 'MandiSlot', 'SoilTest', 'Fertiliser']
  },
  {
    id: 'CEN-2',
    name: 'APMC Mandi Yard & Weighbridge',
    nameHi: 'कृषि उपज मंडी यार्ड व तौल कांटा',
    type: 'APMC Mandi Yard',
    villageOrTown: 'Hinganghat Road, Wardha',
    district: 'Wardha',
    distanceKm: 5.4,
    lat: 20.7289,
    lng: 78.5910,
    phone: '07152-248902',
    operatingHours: '06:00 AM - 06:00 PM',
    currentQueueCount: 14,
    avgWaitTimeMins: 32,
    servicesAvailable: ['MandiSlot']
  },
  {
    id: 'CEN-3',
    name: 'Sevagram Custom Hiring Hub',
    nameHi: 'सेवाग्राम कस्टम हायरिंग हब',
    type: 'Custom Hiring Hub',
    villageOrTown: 'Sevagram Junction',
    district: 'Wardha',
    distanceKm: 2.1,
    lat: 20.7092,
    lng: 78.6514,
    phone: '07152-284199',
    operatingHours: '06:30 AM - 08:00 PM',
    currentQueueCount: 3,
    avgWaitTimeMins: 10,
    servicesAvailable: ['Machinery', 'Fertiliser']
  },
  {
    id: 'CEN-4',
    name: 'Deoli Sub-Mandi Procurement Point',
    nameHi: 'देवली उप-मंडी उपार्जन केंद्र',
    type: 'APMC Mandi Yard',
    villageOrTown: 'Deoli Main Bazar',
    district: 'Wardha',
    distanceKm: 14.2,
    lat: 20.6541,
    lng: 78.4812,
    phone: '07158-223145',
    operatingHours: '08:00 AM - 05:00 PM',
    currentQueueCount: 9,
    avgWaitTimeMins: 24,
    servicesAvailable: ['MandiSlot', 'Fertiliser']
  }
];

export const MOCK_SLOTS: ServiceSlot[] = [
  {
    id: 'SLOT-1',
    centreId: 'CEN-1',
    date: 'Today',
    timeRange: '11:30 AM - 12:30 PM',
    isRecommended: false,
    congestion: 'Heavy',
    availableSpots: 1
  },
  {
    id: 'SLOT-2',
    centreId: 'CEN-1',
    date: 'Today',
    timeRange: '02:00 PM - 03:00 PM',
    isRecommended: false,
    congestion: 'Moderate',
    availableSpots: 4
  },
  {
    id: 'SLOT-3',
    centreId: 'CEN-1',
    date: 'Tomorrow (Mon)',
    timeRange: '08:30 AM - 09:30 AM',
    isRecommended: true,
    recommendationReason: 'Smart Slot: 0% rain forecast, lowest gate queue, saves ~45 mins waiting time.',
    recommendationReasonHi: 'स्मार्ट स्लॉट: बारिश की 0% संभावना, न्यूनतम कतार, लगभग 45 मिनट की बचत।',
    congestion: 'Low',
    availableSpots: 8
  },
  {
    id: 'SLOT-4',
    centreId: 'CEN-1',
    date: 'Tomorrow (Mon)',
    timeRange: '10:00 AM - 11:00 AM',
    isRecommended: false,
    congestion: 'Moderate',
    availableSpots: 6
  }
];

export const INITIAL_TOKENS: AgriToken[] = [
  {
    id: 'TOK-108',
    tokenNumber: 'AS-108',
    farmerId: 'FARM-8921',
    farmerName: 'Rameshwar Patil',
    farmerNameHi: 'रामेश्वर पाटिल',
    farmerPhone: '+91 98224 81920',
    kisanId: 'MH-WRD-8921',
    serviceType: 'MandiSlot',
    centreId: 'CEN-2',
    centreName: 'APMC Mandi Yard & Weighbridge',
    centreNameHi: 'कृषि उपज मंडी यार्ड व तौल कांटा',
    scheduledTime: 'Today, 11:30 AM',
    counterAssigned: 2,
    status: 'Called',
    estimatedWaitMins: 4,
    peopleAhead: 1,
    priority: false,
    issueTimestamp: 'Today, 10:45 AM',
    qrCodeValue: 'AGRISEVA-TOKEN-AS-108-MH-WRD-8921',
    serviceDetails: {
      cropName: 'Soyabean (Yellow)',
      cropNameHi: 'सोयाबीन (पीला)',
      approxQuintals: 42
    }
  },
  {
    id: 'TOK-109',
    tokenNumber: 'AS-109',
    farmerId: 'FARM-4412',
    farmerName: 'Baburao Deshmukh',
    farmerNameHi: 'बाबूराव देशमुख',
    farmerPhone: '+91 94231 09841',
    kisanId: 'MH-WRD-4412',
    serviceType: 'Machinery',
    centreId: 'CEN-3',
    centreName: 'Sevagram Custom Hiring Hub',
    centreNameHi: 'सेवाग्राम कस्टम हायरिंग हब',
    scheduledTime: 'Today, 12:00 PM',
    counterAssigned: 1,
    status: 'Waiting',
    estimatedWaitMins: 14,
    peopleAhead: 2,
    priority: false,
    issueTimestamp: 'Today, 11:00 AM',
    qrCodeValue: 'AGRISEVA-TOKEN-AS-109-MH-WRD-4412',
    serviceDetails: {
      machineryType: 'Mahindra 47HP Tractor + Rotavator',
      acreage: 4.5
    }
  },
  {
    id: 'TOK-110',
    tokenNumber: 'AS-110',
    farmerId: 'FARM-9011',
    farmerName: 'Sunita Bai Dhurve',
    farmerNameHi: 'सुनीता बाई धुर्वे',
    farmerPhone: '+91 97654 32189',
    kisanId: 'MH-WRD-9011',
    serviceType: 'Fertiliser',
    centreId: 'CEN-1',
    centreName: 'Wardha Central AgriSeva Kendra',
    centreNameHi: 'वर्धा केंद्रीय कृषि सेवा केंद्र',
    scheduledTime: 'Today, 12:15 PM',
    counterAssigned: 3,
    status: 'Waiting',
    estimatedWaitMins: 22,
    peopleAhead: 4,
    priority: true,
    issueTimestamp: 'Today, 11:15 AM',
    qrCodeValue: 'AGRISEVA-TOKEN-AS-110-MH-WRD-9011',
    serviceDetails: {
      fertiliserBags: 4
    }
  },
  {
    id: 'TOK-105',
    tokenNumber: 'AS-105',
    farmerId: 'FARM-7721',
    farmerName: 'Devidas Shinde',
    farmerNameHi: 'देवीदास शिंदे',
    farmerPhone: '+91 98812 77610',
    kisanId: 'MH-WRD-7721',
    serviceType: 'SoilTest',
    centreId: 'CEN-1',
    centreName: 'Wardha Central AgriSeva Kendra',
    centreNameHi: 'वर्धा केंद्रीय कृषि सेवा केंद्र',
    scheduledTime: 'Today, 10:30 AM',
    counterAssigned: 4,
    status: 'Completed',
    estimatedWaitMins: 0,
    peopleAhead: 0,
    priority: false,
    issueTimestamp: 'Today, 10:00 AM',
    qrCodeValue: 'AGRISEVA-TOKEN-AS-105-MH-WRD-7721',
    serviceDetails: {
      cropName: 'Cotton Parcel Soil Sample'
    }
  }
];

export const INITIAL_PROCUREMENT: ProcurementRecord[] = [
  {
    id: 'PROC-904',
    tokenId: 'TOK-108',
    slipNumber: 'MND-2026-904',
    farmerName: 'Rameshwar Patil',
    farmerNameHi: 'रामेश्वर पाटिल',
    kisanId: 'MH-WRD-8921',
    cropName: 'Soyabean (Grade A Yellow)',
    cropNameHi: 'सोयाबीन (ग्रेड ए पीला)',
    grossWeightQuintals: 48.6,
    tareWeightQuintals: 6.4,
    netWeightQuintals: 42.2,
    moisturePercentage: 11.2,
    foreignMatterPercentage: 0.8,
    qualityGrade: 'FAQ Grade A',
    mspPerQuintal: 4892,
    totalGrossPayable: 206442.40,
    dbtStatus: 'Advice Generated',
    utrNumber: 'SBI92810984210',
    timestamp: 'Today, 11:42 AM'
  },
  {
    id: 'PROC-901',
    tokenId: 'TOK-099',
    slipNumber: 'MND-2026-901',
    farmerName: 'Gajananrao Thakre',
    farmerNameHi: 'गजाननराव ठाकरे',
    kisanId: 'MH-WRD-6629',
    cropName: 'Cotton (Medium Staple)',
    cropNameHi: 'कपास (मध्यम रेशा)',
    grossWeightQuintals: 36.8,
    tareWeightQuintals: 5.2,
    netWeightQuintals: 31.6,
    moisturePercentage: 8.5,
    foreignMatterPercentage: 1.2,
    qualityGrade: 'FAQ Grade A',
    mspPerQuintal: 7121,
    totalGrossPayable: 225023.60,
    dbtStatus: 'Transferred',
    utrNumber: 'BOI88219082341',
    timestamp: 'Yesterday, 03:15 PM'
  }
];

export const FLEET_ASSETS: MachineryAsset[] = [
  {
    id: 'MAC-1',
    code: 'TRAC-01',
    registrationNumber: 'MH-32-BA-9012',
    name: 'Swaraj 855 FE (52 HP)',
    nameHi: 'स्वराज 855 एफई (52 एचपी)',
    category: 'Tractor',
    capacityOrHp: '52 HP 4WD',
    hourlyRentalInr: 450,
    status: 'In-Field',
    fuelBatteryLevel: 82,
    assignedFarmer: 'Harpreet Singh',
    assignedVillage: 'Deoli Sector-2',
    acresCoveredToday: 14.5,
    operatorName: 'Sanjay Ghode',
    operatorPhone: '+91 99234 11092',
    lat: 20.738,
    lng: 78.595
  },
  {
    id: 'MAC-2',
    code: 'DRON-01',
    registrationNumber: 'UIN-AGRI-MH-04',
    name: 'Garuda Kisan 16L Drone',
    nameHi: 'गरुड़ किसान 16L स्प्रे ड्रोन',
    category: 'Garuda Drone Sprayer',
    capacityOrHp: '16 Litre Tank (30 Acres/Day)',
    hourlyRentalInr: 320,
    status: 'Available',
    fuelBatteryLevel: 94,
    acresCoveredToday: 26.0,
    operatorName: 'Pravin Wankhede (Certified Pilot)',
    operatorPhone: '+91 94033 89123',
    lat: 20.712,
    lng: 78.648
  },
  {
    id: 'MAC-3',
    code: 'HARV-01',
    registrationNumber: 'MH-31-CB-8819',
    name: 'Preet 987 Combine Harvester',
    nameHi: 'प्रीत 987 कंबाइन हार्वेस्टर',
    category: 'Combine Harvester',
    capacityOrHp: '101 HP Heavy Duty',
    hourlyRentalInr: 1250,
    status: 'Dispatched',
    fuelBatteryLevel: 68,
    assignedFarmer: 'Kailash Choudhary',
    assignedVillage: 'Sevagram Khurd',
    acresCoveredToday: 18.2,
    operatorName: 'Jagtar Singh',
    operatorPhone: '+91 98231 44510',
    lat: 20.701,
    lng: 78.665
  },
  {
    id: 'MAC-4',
    code: 'TRAC-02',
    registrationNumber: 'MH-32-AK-4412',
    name: 'Mahindra Yuvo 575 DI',
    nameHi: 'महिंद्रा युवराज 575 डीआई',
    category: 'Tractor',
    capacityOrHp: '47 HP Rotavator Attached',
    hourlyRentalInr: 420,
    status: 'Available',
    fuelBatteryLevel: 88,
    acresCoveredToday: 8.0,
    operatorName: 'Vilas Raut',
    operatorPhone: '+91 99754 09124',
    lat: 20.742,
    lng: 78.601
  }
];

export const DBT_TRANSACTIONS: DbtTransaction[] = [
  {
    id: 'TXN-1',
    utrNumber: 'DBT202609129841',
    date: '12 Sep 2026',
    scheme: 'MSP Soyabean Procurement Payout',
    amountInr: 206442.40,
    status: 'Processing',
    bankMasked: 'SBI •••• 4921',
    description: 'Procurement Slip MND-2026-904 for 42.2 Qtl Soyabean',
    descriptionHi: 'उपार्जन पर्ची MND-2026-904: 42.2 क्विंटल सोयाबीन भुगतान'
  },
  {
    id: 'TXN-2',
    utrNumber: 'PMK202608104421',
    date: '10 Aug 2026',
    scheme: 'PM-Kisan 17th Installment',
    amountInr: 2000.00,
    status: 'Credited',
    bankMasked: 'SBI •••• 4921',
    description: 'Central Direct Benefit Transfer for Income Support',
    descriptionHi: 'प्रधानमंत्री किसान सम्मान निधि 17वीं किस्त'
  },
  {
    id: 'TXN-3',
    utrNumber: 'SMAM202605151120',
    date: '15 May 2026',
    scheme: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    amountInr: 3450.00,
    status: 'Credited',
    bankMasked: 'SBI •••• 4921',
    description: 'Tractor Hiring 50% Rental Subsidy for Small/Marginal Farmer',
    descriptionHi: 'कस्टम हायरिंग ट्रैक्टर किराया 50% सरकारी अनुदान'
  }
];

export const INITIAL_BUSINESS_RULES: BusinessRuleConfig = {
  mspRates: [
    { crop: 'Soyabean (Yellow)', msp: 4892, maxMoistureFAQ: 12.0, deductionPerMoisturePoint: 48.90 },
    { crop: 'Cotton (Medium Staple)', msp: 7121, maxMoistureFAQ: 8.0, deductionPerMoisturePoint: 71.20 },
    { crop: 'Wheat (Sharbati/Lokwan)', msp: 2275, maxMoistureFAQ: 12.0, deductionPerMoisturePoint: 22.75 },
    { crop: 'Gram (Chana)', msp: 5440, maxMoistureFAQ: 14.0, deductionPerMoisturePoint: 54.40 }
  ],
  subsidyDiscountPctSmallFarmers: 50,
  maxDailyBookingsPerFarmer: 2,
  queuePacingPerHour: 8,
  autoCallIntervalMins: 12,
  alertEmergencyBroadcast: 'IMD Alert: Moderate rain with thunderstorm predicted in Wardha district over next 36 hours. Delay open-field harvesting.',
  alertEmergencyBroadcastHi: 'मौसम विभाग चेतावनी: अगले 36 घंटों में वर्धा जिले में मध्यम बारिश और आंधी की संभावना। खुली फसल कटाई स्थगित रखें।'
};

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  hi: {
    appName: 'कृषि सेवा',
    tagline: 'किसान कमान, सेवा एवं उपार्जन मंच',
    switchRole: 'भूमिका बदलें',
    farmerTitle: 'किसान अनुभव (Farmer)',
    supervisorTitle: 'सुपरवाइजर कंसोल (Supervisor)',
    superAdminTitle: 'सुपर एडमिन (State Admin)',
    greeting: 'नमस्ते,',
    kisanId: 'किसान आईडी',
    activeToken: 'सक्रिय टोकन पास',
    bookService: 'नई सेवा बुक करें',
    mandiPass: 'मंडी उपार्जन',
    machineryHire: 'कृषि यंत्र किराया',
    soilTesting: 'मृदा स्वास्थ्य',
    fertiliserQuota: 'खाद सब्सिडी',
    liveQueue: 'लाइव कतार',
    procurementJourney: 'फसल तौल व गुणवत्ता',
    dbtPayments: 'डीबीटी भुगतान',
    centresDirections: 'निकटतम केंद्र',
    profileLand: 'किसान व भूमि विवरण',
    kisanMitraVoice: 'किसान मित्र आवाज',
    helpline: 'टोल-फ्री हेल्पलाइन',
    offlineMode: 'ऑफ़लाइन मोड',
    weatherSunny: 'धूप खिली, छिड़काव हेतु अनुकूल'
  },
  en: {
    appName: 'AgriSeva',
    tagline: 'Unified Farmer Services & Operations Platform',
    switchRole: 'Switch Role',
    farmerTitle: 'Farmer Experience',
    supervisorTitle: 'Supervisor Console',
    superAdminTitle: 'Super Admin Strategy',
    greeting: 'Welcome,',
    kisanId: 'Kisan ID',
    activeToken: 'Active Token Pass',
    bookService: 'Book a Service',
    mandiPass: 'Mandi Inward',
    machineryHire: 'Custom Hiring',
    soilTesting: 'Soil Testing',
    fertiliserQuota: 'Fertiliser Quota',
    liveQueue: 'Live Queue',
    procurementJourney: 'Procurement Journey',
    dbtPayments: 'DBT Payments',
    centresDirections: 'Centres & Directions',
    profileLand: 'Farmer & Land Records',
    kisanMitraVoice: 'Kisan Mitra AI Voice',
    helpline: 'Toll-Free Helpline',
    offlineMode: 'Offline Mode',
    weatherSunny: 'Sunny, Optimal for Spraying'
  },
  mr: {
    appName: 'कृषी सेवा',
    tagline: 'शेतकरी सेवा व धान्य खरेदी व्यासपीठ',
    switchRole: 'भूमिका बदला',
    farmerTitle: 'शेतकरी अनुभव',
    supervisorTitle: 'पर्यवेक्षक कन्सोल',
    superAdminTitle: 'सुपर ॲडमिन',
    greeting: 'नमस्कार,',
    kisanId: 'शेतकरी आयडी',
    activeToken: 'सक्रिय टोकन पास',
    bookService: 'नवीन सेवा बुक करा',
    mandiPass: 'बाजार समिती नोंद',
    machineryHire: 'यंत्रे भाडेतत्वावर',
    soilTesting: 'माती परीक्षण',
    fertiliserQuota: 'खते कोटा',
    liveQueue: 'थेट रांग',
    procurementJourney: 'धान्य मोजणी व प्रतवारी',
    dbtPayments: 'डीबीटी खात्यावर जमा',
    centresDirections: 'जवळची केंद्रे',
    profileLand: 'शेतकरी व जमीन ७/१२',
    kisanMitraVoice: 'किसान मित्र आवाज',
    helpline: 'टोल-फ्री हेल्पलाईन',
    offlineMode: 'ऑफलाईन मोड',
    weatherSunny: 'स्वच्छ हवामान, फवारणीसाठी योग्य'
  },
  pa: {
    appName: 'ਖੇਤੀ ਸੇਵਾ',
    tagline: 'ਕਿਸਾਨ ਸੇਵਾ ਅਤੇ ਖਰੀਦ ਪਲੇਟਫਾਰਮ',
    switchRole: 'ਭੂਮਿਕਾ ਬਦਲੋ',
    farmerTitle: 'ਕਿਸਾਨ ਅਨੁਭਵ',
    supervisorTitle: 'ਸੁਪਰਵਾਈਜ਼ਰ ਕੰਸੋਲ',
    superAdminTitle: 'ਸੁਪਰ ਐਡਮਿਨ',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ,',
    kisanId: 'ਕਿਸਾਨ ਆਈਡੀ',
    activeToken: 'ਸਰਗਰਮ ਟੋਕਨ ਪਾਸ',
    bookService: 'ਨਵੀਂ ਸੇਵਾ ਬੁੱਕ ਕਰੋ',
    mandiPass: 'ਮੰਡੀ ਆਮਦ',
    machineryHire: 'ਮਸ਼ੀਨਰੀ ਕਿਰਾਇਆ',
    soilTesting: 'ਮਿੱਟੀ ਪਰਖ',
    fertiliserQuota: 'ਖਾਦ ਕੋਟਾ',
    liveQueue: 'ਲਾਈਵ ਕਤਾਰ',
    procurementJourney: 'ਫਸਲ ਤੋਲ ਅਤੇ ਗੁਣਵੱਤਾ',
    dbtPayments: 'ਡੀਬੀਟੀ ਭੁਗਤਾਨ',
    centresDirections: 'ਨੇੜਲੇ ਕੇਂਦਰ',
    profileLand: 'ਕਿਸਾਨ ਤੇ ਜ਼ਮੀਨ ਰਿਕਾਰਡ',
    kisanMitraVoice: 'ਕਿਸਾਨ ਮਿੱਤਰ ਆਵਾਜ਼',
    helpline: 'ਟੋਲ-ਫ੍ਰੀ ਹੈਲਪਲਾਈਨ',
    offlineMode: 'ਆਫਲਾਈਨ ਮੋਡ',
    weatherSunny: 'ਸਾਫ ਮੌਸਮ, ਛਿੜਕਾਅ ਲਈ ਢੁਕਵਾਂ'
  }
};

export const INTEGRATION_AUDIT_DATA: IntegrationAuditItem[] = [
  {
    id: 'AUD-01',
    featureName: 'Intelligent Slot Recommendation Engine',
    subsystem: 'Kisan Mitra',
    status: 'LIVE',
    badgeTag: 'Client Algorithm',
    currentPrototype: 'Fully executable in-browser scoring algorithm. Evaluates real-time gate queue velocity, historical Kendra throughput rates, and 48-hour precipitation forecasts to compute optimal arrival windows.',
    productionIntegration: 'AgriSeva Center Orchestrator Pacing Service deployed on NIC/State Cloud edge servers, receiving real-time vehicle ANPR feed.',
    dataFlow: {
      input: 'Farmer geo-location, requested crop/quintals, selected Kendra ID, current active token tally.',
      processing: 'Multi-variable penalty matrix: Penalizes rainy forecast windows and congested arrival bands (11:00 AM - 01:00 PM).',
      output: 'Recommended arrival slot (e.g. 08:30 - 09:30 AM) with lowest expected gate wait time (<12 mins).'
    },
    authentication: 'Farmer session token (signed JWT) validated against Kendra local registry.',
    offlineBehaviour: 'Runs 100% offline using locally cached operational rules and default off-peak morning distribution.',
    failureHandling: 'Graceful fallback to first-come-first-served (FCFS) slot selection if heuristics cannot compute.',
    security: 'Zero external telemetry transmission; all calculations execute client-side or on secured local edge node.',
    judgeFaq: {
      question: 'Is the slot recommendation engine actually executing live logic?',
      answer: 'LIVE — Yes, the heuristic scoring function executes directly in the prototype based on real-time token states and weather hazard indices.'
    }
  },
  {
    id: 'AUD-02',
    featureName: 'Digital Weighbridge & Lab Moisture Terminal',
    subsystem: 'Command Center',
    status: 'LIVE',
    badgeTag: 'IS 9281 Net Tare Engine',
    currentPrototype: 'Fully operational inward calculation terminal. Takes Gross vehicle weight and Tare weight, automatically applies IS 9281 standard formula, checks moisture against FAQ (<12%) threshold, applies moisture deduction if between 12-14%, and generates APMC inward slip with UTR advice.',
    productionIntegration: 'Direct RS-232 / Modbus serial interface to Mettler-Toledo or Avery Weigh-Tronix load cell indicator and digital moisture meter.',
    dataFlow: {
      input: 'Gross weighment (kg), Tare weighment (kg), digital moisture meter % reading.',
      processing: 'Net Weight = Gross - Tare; Moisture Deduction = if moisture > 12% then (moisture - 12%) * 0.75 * Net; Final Procurement Weight = Net - Deduction.',
      output: 'Cryptographically numbered APMC Inward Voucher, farmer SMS dispatch advice, and automated DBT transaction trigger.'
    },
    authentication: 'Supervisor role-based credential with biometric fingerprint authentication on weighbridge kiosk.',
    offlineBehaviour: 'Local weighbridge slip buffer persists to browser IndexedDB/LocalStorage; prints physical thermal receipt with signed QR.',
    failureHandling: 'Manual tare weight slip backup mode requiring dual supervisor electronic override sign-off.',
    security: 'Immutable weighbridge audit trail; values locked once voucher is generated to eliminate human tampering.',
    judgeFaq: {
      question: 'Does the weighbridge terminal really compute the deduction formulas?',
      answer: 'LIVE — Yes, the net weight, moisture penalty curve, and gross MSP payable formulas are fully executable and generate active records.'
    }
  },
  {
    id: 'AUD-03',
    featureName: 'Multilingual Voice Assistant (Kisan Mitra)',
    subsystem: 'Kisan Mitra',
    status: 'LIVE',
    badgeTag: 'Web Speech API',
    currentPrototype: 'Live browser speech synthesis (SpeechSynthesisUtterance) and speech recognition (webkitSpeechRecognition) supporting Hindi, English, Marathi, and Punjabi with conversational queries and audio cue chimes.',
    productionIntegration: 'Bhashini / Indic Whisper ASR + AI Voice Bot deployed with low-latency SIP telephony bridge.',
    dataFlow: {
      input: 'Spoken farmer voice query via microphone or button tap.',
      processing: 'Intent recognition matching keywords (tokens, mandi, weather, payment, land) mapped to localized agricultural dictionary.',
      output: 'Spoken voice reply in native language + automated screen navigation or state trigger.'
    },
    authentication: 'Browser microphone permission grant; zero remote voice recording stored.',
    offlineBehaviour: 'Speech synthesis uses on-device system voices and pre-rendered audio notification chimes.',
    failureHandling: 'Instant visual text transcript and one-tap quick topic action chips if speech recognition is unavailable.',
    security: 'Audio streams are processed transiently in memory; never persisted to external cloud servers.',
    judgeFaq: {
      question: 'Is the voice assistant connected to a remote AI voice server?',
      answer: 'LIVE — It executes natively in the browser via the W3C Web Speech API; production roadmap targets the Bhashini Indic speech stack.'
    }
  },
  {
    id: 'AUD-04',
    featureName: 'Dynamic MSP Pricing & Policy Configuration',
    subsystem: 'Super Admin Governance',
    status: 'LIVE',
    badgeTag: 'State Policy Engine',
    currentPrototype: 'Operational administrative control panel where Super Admins adjust district MSP rates (₹/quintal), FAQ moisture tolerance levels, mechanization subsidy percentages, and gate pacing quotas with immediate propagation to all consoles.',
    productionIntegration: 'Maharashtra State Agriculture Marketing Board (MSAMB) / e-NAM gazetted policy distribution API.',
    dataFlow: {
      input: 'Updated MSP rate per crop, moisture cutoff percentage, smallholder rental discount percentage.',
      processing: 'State parameter store update with timestamp and admin audit signature; instant reactive broadcast to active farmer/supervisor views.',
      output: 'Recalibrated inward calculation formula for subsequent weighbridge slips and subsidy invoices.'
    },
    authentication: 'Super Admin multi-factor authentication with admin authorization token.',
    offlineBehaviour: 'Default Gazetted Kharif/Rabi Minimum Support Price schedule preserved in offline configuration schema.',
    failureHandling: 'Reverts to previous gazetted schedule if validation constraints fail.',
    security: 'Audit-logged administrative changes with cryptographic hash stamping.',
    judgeFaq: {
      question: 'Does changing the MSP in Super Admin actually change farmer calculations?',
      answer: 'LIVE — Yes, modifying MSP rates in the Super Admin governance panel updates the live application state and recalculates future procurement vouchers.'
    }
  },
  {
    id: 'AUD-05',
    featureName: 'Digital Queue Pass & Inward Gate Stepper',
    subsystem: 'Kisan Mitra',
    status: 'SYNCED',
    badgeTag: 'Offline Available (PWA)',
    currentPrototype: 'Reactive synchronized state machine tracking token progress through 4 stages: Gate Inward → Counter Verification → Weighbridge → DBT Advice. Persists locally in LocalStorage/PWA cache; synchronized across roles.',
    productionIntegration: 'State-wide Redis WebSocket cluster with MQTT push notification broker and telecom SMS shortcode mirror.',
    dataFlow: {
      input: 'Token booking request or supervisor counter call action.',
      processing: 'State transition validator ensuring strict sequential movement (Booked → Called → In-Inspection → Completed).',
      output: 'High-contrast digital pass screen with dynamic QR code, estimated wait time, people ahead count, and chime alert.'
    },
    authentication: 'Kisan ID + Token Cryptographic Hash validation.',
    offlineBehaviour: 'Token remains 100% accessible and readable by gate barcode scanners even in total 4G dead zones.',
    failureHandling: 'Local token cache loaded automatically on startup; sync queue flushes on reconnect.',
    security: 'Token QR embeds digital signature preventing fraudulent duplicate token presentations.',
    judgeFaq: {
      question: 'Is the queue token synchronized with a remote cloud server right now?',
      answer: 'SYNCED — The queue pass is synchronized across farmer and supervisor views via local state persistence, maintaining full offline validity without needing live internet.'
    }
  },
  {
    id: 'AUD-06',
    featureName: 'Direct Benefit Transfer (DBT) & PFMS Settlement',
    subsystem: 'Kisan Mitra',
    status: 'INTEGRATION-READY',
    badgeTag: 'PFMS / NPCI APB',
    currentPrototype: 'Accurately models the Aadhaar Payment Bridge (APB) passbook, displaying masked bank accounts, real-time PFMS transaction ledger, UTR numbers, and automated payment advice slips generated by the weighbridge inward slip.',
    productionIntegration: 'Public Financial Management System (PFMS) REST API + National Payments Corporation of India (NPCI) Aadhaar Payment Bridge System (APBS) ISO 20022 XML interface.',
    dataFlow: {
      input: 'APMC Weighbridge procurement voucher total (₹), farmer Aadhaar number (UID), DBT scheme code.',
      processing: 'PFMS Sanction generation → Aadhaar mapper lookup → RBI RTGS/NEFT settlement batch creation → Bank core banking credit.',
      output: 'Unique 16-digit UTR reconciliation code, timestamped bank passbook credit entry, and DLT SMS notification.'
    },
    authentication: 'Government Department digital signature certificate (DSC) via Class 3 PKI token + mTLS.',
    offlineBehaviour: 'Generates an encrypted offline DBT Advice Voucher stored on the farmer device; queued for batch clearance once network resumes.',
    failureHandling: 'Automatic re-routing through PFMS fallback mandate queue if bank server times out.',
    security: 'Aadhaar numbers masked (UIDAI compliance); zero plaintext bank details exposed in transit.',
    judgeFaq: {
      question: 'Is PFMS actually connected and transferring real rupees right now?',
      answer: 'INTEGRATION-READY — The prototype demonstrates the passbook experience, transaction schema, and automated payment advice generation; production deployment requires authorized government PFMS/NPCI API access.'
    }
  },
  {
    id: 'AUD-07',
    featureName: 'Bhulekh 7/12 Land Records & Khasra Verification',
    subsystem: 'Kisan Mitra',
    status: 'INTEGRATION-READY',
    badgeTag: 'Mahabhulekh REST v3',
    currentPrototype: 'Demonstrates verified 7/12 land parcels, survey/khasra numbers, crop area validation, and Soil Health Card records linked to the farmer digital identity.',
    productionIntegration: 'Mahabhulekh Land Records API (Department of Revenue, Govt. of Maharashtra) via AgriStack Unified Farmer Interface (UFI).',
    dataFlow: {
      input: 'Farmer Aadhaar e-KYC or Kisan ID + Village Census Code (LGD).',
      processing: 'AgriStack RoR (Record of Rights) verification matching land ownership registry with satellite crop-sown cadastral maps.',
      output: 'Authorized land parcel area (hectares), permitted procurement quota, and soil nutrient card.'
    },
    authentication: 'State Single Sign-On (SSO) with Digital Signature verification and OAuth 2.0 Client Credentials.',
    offlineBehaviour: 'Digitally signed 7/12 summary cached locally for 90 days; verified offline via QR code scanning.',
    failureHandling: 'Supervisor physical KCC / land revenue passbook manual verification with document camera capture.',
    security: 'Complies with Digital Personal Data Protection Act (DPDPA); land records read-only and restricted to authenticated farmer.',
    judgeFaq: {
      question: 'Are you pulling live 7/12 records directly from the state revenue server?',
      answer: 'INTEGRATION-READY — The schema and UI reflect authentic Mahabhulekh RoR data contracts; live queries require state NIC revenue portal API whitelisting.'
    }
  },
  {
    id: 'AUD-08',
    featureName: 'IMD Agro-Meteorological Doppler Feed',
    subsystem: 'Kisan Mitra',
    status: 'INTEGRATION-READY',
    badgeTag: 'IMD Mausam REST',
    currentPrototype: 'Displays localized weather cards, temperature (28°C Wardha), cloud cover, and harvesting/spraying advisories (optimal vs high-risk rain windows) integrated into the booking engine.',
    productionIntegration: 'India Meteorological Department (IMD) Mausam API + Gramin Krishi Mausam Sewa (GKMS) Agromet Advisory Service.',
    dataFlow: {
      input: 'Kendra latitude/longitude coordinates (Wardha APMC: 20.7453° N, 78.6022° E).',
      processing: 'Doppler radar precipitation probability forecast + 3-day rainfall accumulation model.',
      output: 'Field condition rating (Optimal / Caution / High Risk) and rainfall probability window.'
    },
    authentication: 'IMD Open Data Portal API Key over TLS 1.3.',
    offlineBehaviour: 'Persists the last received 48-hour agromet bulletin; displays "Cached at 06:00 AM" timestamp.',
    failureHandling: 'Uses district-level seasonal historical averages if real-time radar feed is unreachable.',
    security: 'Public meteorological data; no private farmer data exchanged.',
    judgeFaq: {
      question: 'Is the weather reading a live satellite Doppler connection?',
      answer: 'INTEGRATION-READY — The UI and recommendation engine integrate the data contract and hazard rules; production connection binds to the IMD Mausam API.'
    }
  },
  {
    id: 'AUD-09',
    featureName: 'Machinery Fleet Telemetry (AIS-140 GPS & Sensors)',
    subsystem: 'Command Center',
    status: 'INTEGRATION-READY',
    badgeTag: 'AIS-140 & CAN-bus',
    currentPrototype: 'Supervisor fleet dispatch console displaying 4 Custom Hiring Centre (CHC) machines (tractors, drone sprayers, combine harvesters) with live fuel/battery gauges, operator phone contacts, field sector assignments, and one-click dispatch/recall.',
    productionIntegration: 'MoRTH AIS-140 compliant GPS vehicle trackers + CAN-Bus J1939 telematics stream routed via MQTT broker.',
    dataFlow: {
      input: 'Telemetry packets: latitude, longitude, speed, fuel level, engine hours, battery voltage.',
      processing: 'Geofence boundary calculation around village clusters; SMAM subsidy booking reconciliation.',
      output: 'Real-time equipment availability grid, estimated arrival time to farmer field, and dispatch log.'
    },
    authentication: 'Mutual TLS (mTLS) with device X.509 cryptographic certificates.',
    offlineBehaviour: 'Tractor onboard AIS-140 device buffers up to 50,000 GPS points in local flash memory during cellular blackouts.',
    failureHandling: 'Supervisor manual SMS dispatch to certified operator with voice phone confirmation.',
    security: 'Encrypted telemetry payloads; operator phone numbers masked in public interfaces.',
    judgeFaq: {
      question: 'Are there actual GPS beacons connected to physical tractors right now?',
      answer: 'INTEGRATION-READY — The prototype implements the full fleet operational console, dispatch workflows, and telemetry schema; production requires physical AIS-140 GPS hardware units.'
    }
  },
  {
    id: 'AUD-10',
    featureName: 'Multichannel IVR & Toll-Free Phone Integration',
    subsystem: 'Kisan Mitra',
    status: 'INTEGRATION-READY',
    badgeTag: 'C-DAC / SIP Trunk',
    currentPrototype: 'Integrated Kisan Helpline card with one-touch direct dial (1800-180-1551), simulated keypad feature phone SMS booking flows, and multilingual audio guidance prompts.',
    productionIntegration: 'C-DAC Kisan Call Centre SIP Trunking + Twilio / Exotel Voice XML IVR tree.',
    dataFlow: {
      input: 'Farmer incoming phone call or DTMF touch-tone keypresses from standard keypad feature phone.',
      processing: 'Voice IVR menu traversal ("Press 1 for Hindi, Press 2 to check Queue Token status").',
      output: 'Automated synthetic voice reading out live token number, counter assignment, and estimated wait.'
    },
    authentication: 'Caller ID (ANI / CLI) verification against registered Kisan mobile numbers.',
    offlineBehaviour: 'Telephony operates over standard 2G GSM cellular networks; requires zero smartphone internet.',
    failureHandling: 'Automatic failover to live district APMC call centre human operator.',
    security: 'TRAI DLT compliant telecom headers; zero unencrypted audio storage.',
    judgeFaq: {
      question: 'Can a farmer on a simple 2G keypad phone actually use this system?',
      answer: 'INTEGRATION-READY — The data schema and queue notification payloads are formatted for two-way SMS and IVR voice synthesis; production deployment connects to the Kisan Call Centre SIP gateway.'
    }
  },
  {
    id: 'AUD-11',
    featureName: 'Predictive Gate Arrival Pacing (ML Congestion)',
    subsystem: 'Command Center',
    status: 'PROPOSED',
    badgeTag: 'ML Neural Pacing',
    currentPrototype: 'Conceptual design and user experience wireframe showing predicted hourly traffic congestion bars and automated gating quotas.',
    productionIntegration: 'Time-series forecasting model (LSTM / Gemini Flash Multimodal) processing CCTV road ingress video and historical mandi arrival patterns.',
    dataFlow: {
      input: 'Historical 5-year mandi harvest arrival rates, district tractor ownership density, festival calendars.',
      processing: 'Machine learning inference projecting probability of gate bottlenecks 72 hours in advance.',
      output: 'Dynamic hourly booking caps enforced during high-risk road congestion windows.'
    },
    authentication: 'Service account API key with rate limiting.',
    offlineBehaviour: 'Falls back to static supervisor-defined hourly token quotas.',
    failureHandling: 'Manual gate entry bypass operated by security personnel.',
    security: 'Aggregated statistical data only; no individual farmer tracking.',
    judgeFaq: {
      question: 'Is there a live machine learning model forecasting mandi road traffic?',
      answer: 'PROPOSED — This is an advanced Phase 2 roadmap concept; currently simulated with standard hourly pacing quotas.'
    }
  },
  {
    id: 'AUD-12',
    featureName: 'Two-Way SMS Shortcode Token Booking (51969)',
    subsystem: 'Kisan Mitra',
    status: 'PROPOSED',
    badgeTag: 'Govt Mobile Seva',
    currentPrototype: 'Simulated UI preview demonstrating feature phone SMS syntax (e.g., text "KENDRA BOOK WARDHA SOYBEAN" to 51969).',
    productionIntegration: 'National Mobile Governance Portal (Mobile Seva) two-way DLT shortcode SMS gateway.',
    dataFlow: {
      input: 'Inbound SMS message payload received from telecom operator.',
      processing: 'Regex command parser validating farmer registration and slot availability.',
      output: 'Outbound confirmation SMS containing token number, date, and security PIN.'
    },
    authentication: 'Mobile number SIM authentication via telecom carrier.',
    offlineBehaviour: 'SMS operates natively without internet connectivity.',
    failureHandling: 'Error message SMS prompting caller to dial the 1800 toll-free helpline.',
    security: 'TRAI commercial communication DLT template registration.',
    judgeFaq: {
      question: 'Can I text a real SMS to 51969 right now to get a token?',
      answer: 'PROPOSED — The SMS message structure and parser logic are fully mapped, but the government 51969 shortcode lease is a future administrative onboarding step.'
    }
  }
];
