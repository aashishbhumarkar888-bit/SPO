/**
 * Centralized Internationalization (i18n) Engine for SPO
 * Comprehensive support for English, Hindi, Marathi, and Punjabi
 */

import { LanguageCode } from '../types';

export interface AppTranslations {
  // Brand & Header
  brandName: string;
  brandTagline: string;
  govtMinistry: string;
  tollFree: string;
  tollFreeLabel: string;
  onlineSync: string;
  offlineCached: string;
  outdoorMode: string;
  outdoorModeActive: string;
  languageSelect: string;

  // Navigation
  navHome: string;
  navBooking: string;
  navQueue: string;
  navProcurement: string;
  navPayments: string;
  navNotifications: string;
  navProfile: string;
  navHelp: string;

  // Farmer Home Dashboard
  greeting: string;
  kisanId: string;
  ekycVerified: string;
  farmlandTotal: string;
  weatherAdvisory: string;
  
  // Current Appointment Card
  todayAppointmentTitle: string;
  noActiveAppointment: string;
  noActiveAppointmentDesc: string;
  bookNewSlotButton: string;
  tokenNumber: string;
  bookingDate: string;
  slotTime: string;
  centreName: string;
  currentStatus: string;
  expectedArrival: string;
  reachByDeadline: string;
  remainingTime: string;
  queuePositionLabel: string;
  peopleAheadLabel: string;
  estimatedWaitLabel: string;
  cropLabel: string;
  bookedQuantityLabel: string;
  remainingQuantityLabel: string;
  primaryNextAction: string;
  actionViewPass: string;
  actionProceedGate: string;
  actionReportCounter: string;
  actionViewWeighment: string;
  actionTrackPayment: string;
  
  // Status Summary
  summaryTitle: string;
  summaryQueue: string;
  summaryProcurement: string;
  summaryPayment: string;
  summaryAlerts: string;

  // Journey Stepper
  journeyTitle: string;
  stepGate: string;
  stepCounter: string;
  stepWeighbridge: string;
  stepQuality: string;
  stepPayment: string;
  currentStageBadge: string;
  stageCompletedBadge: string;
  stagePendingBadge: string;

  // Actions & Buttons
  listenAudio: string;
  directions: string;
  reschedule: string;
  cancelBooking: string;
  confirmAction: string;
  close: string;
  submit: string;
  back: string;
  next: string;

  // Digital Pass & Live Queue
  liveQueueTitle: string;
  digitalPassTitle: string;
  offlinePassNotice: string;
  qrInstruction: string;
  counterAssignedLabel: string;
  syncTimestamp: string;

  // Procurement & Weighbridge
  weighbridgeTitle: string;
  slipNumberLabel: string;
  grossWeight: string;
  tareWeight: string;
  netWeight: string;
  moisturePercent: string;
  foreignMatter: string;
  qualityGrade: string;
  mspRate: string;
  totalPayable: string;
  downloadSlip: string;

  // DBT Payments
  dbtTitle: string;
  npciNotice: string;
  bankAccount: string;
  utrNumber: string;
  statusCredited: string;
  statusProcessing: string;
  totalReceived: string;
  pendingClearance: string;

  // Profile
  profileTitle: string;
  landRecordsTitle: string;
  khasraNumber: string;
  parcelArea: string;
  cropSeason: string;
  soilHealthCard: string;

  // Kisan Mitra Assistant
  kisanMitraTitle: string;
  kisanMitraSubtitle: string;
  askQuestionPlaceholder: string;
  quickCheckBooking: string;
  quickCheckQueue: string;
  quickCheckCentre: string;
  quickCheckPayment: string;
  quickCheckProcurement: string;
  callSupportAction: string;

  // Feedback & States
  loading: string;
  errorGeneric: string;
  retry: string;

  // Operations & Profile / Logout
  logoutButton: string;
  lockTerminalButton: string;
  clearSessionAndLogout: string;
  clearSessionDesc: string;
  clearSessionConfirm: string;
  confirmLogout: string;
  cancel: string;
  sessionActiveStatus: string;
  securityClearance: string;
  changePinAction: string;
  quickReportTitle: string;
  hourlyPacingTitle: string;
  verifiedDocumentWorkflow: string;

  // Portal Landing Gateway
  landingPortalTag: string;
  landingMainTitle: string;
  landingSubtitle: string;
  roleFarmerCitizenService: string;
  roleFarmerTitle: string;
  roleFarmerDesc: string;
  roleFarmerB1: string;
  roleFarmerB2: string;
  roleFarmerB3: string;
  roleFarmerBtn: string;
  roleSupervisorService: string;
  roleSupervisorTitle: string;
  roleSupervisorDesc: string;
  roleSupervisorB1: string;
  roleSupervisorB2: string;
  roleSupervisorB3: string;
  roleSupervisorBtn: string;
  roleAdminService: string;
  roleAdminTitle: string;
  roleAdminDesc: string;
  roleAdminB1: string;
  roleAdminB2: string;
  roleAdminB3: string;
  roleAdminBtn: string;
  sihModeBadge: string;
  sihModeDesc: string;
  demoDrawerBtn: string;

  // Header & General Labels
  mandiLocation: string;
  gatewayHome: string;
  portalGateway: string;
  lightMode: string;
  darkMode: string;
  kisanLogin: string;
  signOut: string;
  stationProfile: string;
  lockExit: string;
  returnToPortalGateway: string;
  switchLightMode: string;
  switchDarkMode: string;
}

export const I18N_RESOURCES: Record<LanguageCode, AppTranslations> = {
  en: {
    brandName: 'SPO — Smart Procurement Orchestration',
    brandTagline: 'Department of Agriculture & Farmers Welfare • Government of India',
    govtMinistry: 'Ministry of Agriculture & Farmers Welfare (NeGPA)',
    tollFree: '1800-180-1551',
    tollFreeLabel: 'Kisan Helpline (Toll-Free)',
    onlineSync: 'Live Cloud Sync',
    offlineCached: 'Offline: Local Pass Cached',
    outdoorMode: 'Field / Sun Mode',
    outdoorModeActive: 'High Contrast Active',
    languageSelect: 'Language',

    navHome: 'Home',
    navBooking: 'My Booking',
    navQueue: 'Queue / Digital Pass',
    navProcurement: 'Procurement Status',
    navPayments: 'Payments',
    navNotifications: 'Notifications',
    navProfile: 'Profile',
    navHelp: 'Help / Kisan Mitra',

    greeting: 'Welcome,',
    kisanId: 'Kisan ID',
    ekycVerified: 'UIDAI e-KYC Verified',
    farmlandTotal: 'Acres Farmland',
    weatherAdvisory: 'Sunny, Optimal for Mandi Inward & Spraying',

    todayAppointmentTitle: "Today's Appointment & Active Booking",
    noActiveAppointment: 'No Active Appointment Today',
    noActiveAppointmentDesc: 'You do not have any active procurement appointment scheduled for today. You can schedule a new slot anytime.',
    bookNewSlotButton: 'Schedule Procurement Slot',
    tokenNumber: 'Pass / Token No.',
    bookingDate: 'Scheduled Date',
    slotTime: 'Operational Window',
    centreName: 'Procurement Centre',
    currentStatus: 'Status',
    expectedArrival: 'Expected Arrival',
    reachByDeadline: 'Reach Kendra By',
    remainingTime: 'Time Remaining',
    queuePositionLabel: 'Queue Position',
    peopleAheadLabel: 'Ahead of You',
    estimatedWaitLabel: 'Estimated Wait',
    cropLabel: 'Commodity',
    bookedQuantityLabel: 'Booked Quantity',
    remainingQuantityLabel: 'Remaining to Process',
    primaryNextAction: 'Required Next Action',
    actionViewPass: 'Open Digital Pass & Barcode',
    actionProceedGate: 'Proceed to Mandi Inward Gate',
    actionReportCounter: 'Report to Counter #',
    actionViewWeighment: 'Review Weighbridge Net Receipt',
    actionTrackPayment: 'Track Direct Benefit Transfer (DBT)',

    summaryTitle: 'Operational Snapshot',
    summaryQueue: 'Live Queue Rank',
    summaryProcurement: 'Weighment Status',
    summaryPayment: 'DBT Payment State',
    summaryAlerts: 'Active Advisories',

    journeyTitle: 'Procurement Progression Journey',
    stepGate: 'Gate Inward',
    stepCounter: 'Verification',
    stepWeighbridge: 'Weighbridge (IS 9281)',
    stepQuality: 'Quality FAQ',
    stepPayment: 'PFMS DBT Credit',
    currentStageBadge: 'Current Stage',
    stageCompletedBadge: 'Completed',
    stagePendingBadge: 'Upcoming',

    listenAudio: 'Listen Details',
    directions: 'Directions',
    reschedule: 'Reschedule Slot',
    cancelBooking: 'Cancel Booking',
    confirmAction: 'Confirm Action',
    close: 'Close',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',

    liveQueueTitle: 'Live Queue & Gate Entry Pass',
    digitalPassTitle: 'Official Digital E-Pass',
    offlinePassNotice: 'Pass remains verifiable offline by Gate ANPR / barcode scanner',
    qrInstruction: 'Show this QR / Barcode at Mandi Gate Inward for instantaneous ANPR entry verification',
    counterAssignedLabel: 'Assigned Counter',
    syncTimestamp: 'Last Synchronized',

    weighbridgeTitle: 'Weighbridge Electronic Slip (IS 9281)',
    slipNumberLabel: 'Inward Slip No.',
    grossWeight: 'Gross Weight',
    tareWeight: 'Tare (Vehicle)',
    netWeight: 'Net Commodity Weight',
    moisturePercent: 'Moisture Content',
    foreignMatter: 'Foreign Matter',
    qualityGrade: 'Quality Grade',
    mspRate: 'Statutory MSP Rate',
    totalPayable: 'Net Gross Payable',
    downloadSlip: 'Download Formal Voucher',

    dbtTitle: 'PFMS / NPCI DBT Direct Credit Passbook',
    npciNotice: 'Aadhaar Payment Bridge System (APBS) Account Direct Credit',
    bankAccount: 'Registered Bank Account',
    utrNumber: 'Banking UTR / Reference',
    statusCredited: 'Credited to Bank Account',
    statusProcessing: 'Processing via RBI / NPCI',
    totalReceived: 'Total Disbursed This Season',
    pendingClearance: 'Under Settlement Clearance',

    profileTitle: 'Farmer Profile & Government KYC',
    landRecordsTitle: 'Digitized Land Parcels (7/12 Land Record)',
    khasraNumber: 'Khasra / Gut No.',
    parcelArea: 'Recorded Area',
    cropSeason: 'Season',
    soilHealthCard: 'Soil Health Card',

    kisanMitraTitle: 'Kisan Mitra Customer Care',
    kisanMitraSubtitle: 'Voice & text assistant grounded in your real procurement records',
    askQuestionPlaceholder: 'Ask about your slot, queue position, payment or weather...',
    quickCheckBooking: 'Check My Booking',
    quickCheckQueue: 'Check Queue Position',
    quickCheckCentre: 'Locate My Centre',
    quickCheckPayment: 'Payment & DBT Status',
    quickCheckProcurement: 'Procurement Weight Details',
    callSupportAction: 'Call Toll-Free 1800-180-1551',

    loading: 'Loading live procurement records...',
    errorGeneric: 'Unable to refresh live data. Showing cached offline state.',
    retry: 'Retry Sync',

    logoutButton: 'Logout & Return to Portal',
    lockTerminalButton: 'Lock Terminal / Exit Session',
    clearSessionAndLogout: 'Clear Session and Logout',
    clearSessionDesc: 'This will securely purge active session storage, reset local authentication tokens, and return to the public home view without preserving any sensitive operational data.',
    clearSessionConfirm: 'Are you sure you want to clear session and logout?',
    confirmLogout: 'Yes, Clear Session and Logout',
    cancel: 'Cancel',
    sessionActiveStatus: 'Session Active & Authenticated',
    securityClearance: 'Security Clearance',
    changePinAction: 'Change Terminal PIN',
    quickReportTitle: 'Quick On-Demand Shift Report',
    hourlyPacingTitle: 'Time-to-Time Hourly Operational Report',
    verifiedDocumentWorkflow: 'Verified Document Inward Workflow',

    // Portal Landing Gateway
    landingPortalTag: 'Smart Procurement Orchestration • Official Portal',
    landingMainTitle: 'Agricultural Procurement & Mandi Operations Gateway',
    landingSubtitle: 'Authenticate with your authorized credentials to access dynamic slot booking, weighbridge validation, or state procurement administration.',
    roleFarmerCitizenService: 'Citizen Self-Service',
    roleFarmerTitle: 'Kisan / Farmer Portal',
    roleFarmerDesc: 'Access dynamic slot booking, live digital token queue, and PFMS DBT passbook via Aadhaar, mobile, or email.',
    roleFarmerB1: 'Real-time Digital Pass & Queue',
    roleFarmerB2: 'Weighment Slip & MSP Calculation',
    roleFarmerB3: 'PFMS Direct Benefit Transfer',
    roleFarmerBtn: 'Farmer Sign In',
    roleSupervisorService: 'Station Operations',
    roleSupervisorTitle: 'Mandi Supervisor Terminal',
    roleSupervisorDesc: 'Real-time inward vehicle logging, digital counter assignment, moisture deductions, and weighment commit.',
    roleSupervisorB1: 'Weighbridge Gross & Tare Capture',
    roleSupervisorB2: 'Counter Calling & Queue Dispatch',
    roleSupervisorB3: 'Quality Assessment & Audit',
    roleSupervisorBtn: 'Supervisor Login',
    roleAdminService: 'State Policy Governance',
    roleAdminTitle: 'State Governance Console',
    roleAdminDesc: 'Configure district dynamic slot quotas, algorithmic emergency overrides, and state-wide procurement analytics.',
    roleAdminB1: 'Cross-District Mandi Analytics',
    roleAdminB2: 'Dynamic Quotas & MSP Rules',
    roleAdminB3: 'Immutable Cryptographic Audit Trail',
    roleAdminBtn: 'State Admin Clearance',
    sihModeBadge: 'SIH Jury Evaluation Mode',
    sihModeDesc: 'Pre-configured credentials for all 3 access levels are available in the Demo Credentials Directory.',
    demoDrawerBtn: 'Demo Credentials Drawer',

    // Header & General Labels
    mandiLocation: 'Wardha Model Mandi (Vidarbha Agro-Zone)',
    gatewayHome: 'Portal Gateway Home',
    portalGateway: 'Gateway',
    lightMode: 'Light',
    darkMode: 'Dark',
    kisanLogin: 'Kisan Login',
    signOut: 'Sign Out',
    stationProfile: 'Station Profile',
    lockExit: 'Lock / Exit',
    returnToPortalGateway: 'Return to Gateway Portal',
    switchLightMode: 'Switch to Light Mode',
    switchDarkMode: 'Switch to Dark Mode'
  },

  hi: {
    brandName: 'एस.पी.ओ — स्मार्ट प्रोक्योरमेंट ऑर्केस्ट्रेशन',
    brandTagline: 'कृषि एवं किसान कल्याण विभाग • भारत सरकार',
    govtMinistry: 'कृषि एवं किसान कल्याण मंत्रालय (राष्ट्रीय ई-गवर्नेंस योजना)',
    tollFree: '1800-180-1551',
    tollFreeLabel: 'किसान हेल्पलाइन (टोल-फ्री)',
    onlineSync: 'क्लाउड लाइव सिंक',
    offlineCached: 'ऑफ़लाइन: ई-पास स्थानीय कैश में सुरक्षित',
    outdoorMode: 'खेत / धूप मोड',
    outdoorModeActive: 'उच्च कंट्रास्ट सक्रिय',
    languageSelect: 'भाषा बदलें',

    navHome: 'मुख्य पृष्ठ',
    navBooking: 'मेरी बुकिंग',
    navQueue: 'कतार / डिजिटल पास',
    navProcurement: 'उपार्जन स्थिति',
    navPayments: 'डीबीटी भुगतान',
    navNotifications: 'सूचनाएं',
    navProfile: 'मेरी प्रोफ़ाइल',
    navHelp: 'सहायता व किसान मित्र',

    greeting: 'नमस्ते,',
    kisanId: 'किसान आईडी',
    ekycVerified: 'आधार e-KYC सत्यापित',
    farmlandTotal: 'एकड़ कुल कृषि भूमि',
    weatherAdvisory: 'मौसम अनुकूल, मंडी आगमन व छिड़काव हेतु उत्तम',

    todayAppointmentTitle: 'आज का निर्धारित उपार्जन एवं सक्रिय स्लॉट',
    noActiveAppointment: 'आज के लिए कोई सक्रिय स्लॉट नहीं है',
    noActiveAppointmentDesc: 'वर्तमान में आज के लिए आपकी कोई उपार्जन बुकिंग नहीं है। आप आगामी तिथि हेतु नया स्लॉट बुक कर सकते हैं।',
    bookNewSlotButton: 'नया उपार्जन स्लॉट बुक करें',
    tokenNumber: 'टोकन / ई-पास संख्या',
    bookingDate: 'बुकिंग तिथि',
    slotTime: 'परिचालन समय विंडो',
    centreName: 'उपार्जन केंद्र',
    currentStatus: 'वर्तमान स्थिति',
    expectedArrival: 'अपेक्षित आगमन',
    reachByDeadline: 'केंद्र पहुंचने का समय',
    remainingTime: 'शेष समय',
    queuePositionLabel: 'कतार स्थिति',
    peopleAheadLabel: 'आपसे आगे किसान',
    estimatedWaitLabel: 'अनुमानित प्रतीक्षा',
    cropLabel: 'फसल उपज',
    bookedQuantityLabel: 'पंजीकृत मात्रा',
    remainingQuantityLabel: 'शेष बची मात्रा',
    primaryNextAction: 'अगला आवश्यक कदम',
    actionViewPass: 'डिजिटल पास व बारकोड देखें',
    actionProceedGate: 'मंडी मुख्य प्रवेश द्वार की ओर जाएं',
    actionReportCounter: 'काउंटर # पर सत्यापन हेतु जाएं',
    actionViewWeighment: 'इलेक्ट्रॉनिक तौल पर्ची देखें',
    actionTrackPayment: 'डीबीटी बैंक अंतरण स्थिति जांचें',

    summaryTitle: 'आज की स्थिति का संक्षिप्त सारांश',
    summaryQueue: 'कतार में स्थान',
    summaryProcurement: 'तौल स्थिति',
    summaryPayment: 'डीबीटी भुगतान',
    summaryAlerts: 'महत्वपूर्ण सूचनाएं',

    journeyTitle: 'उपार्जन प्रक्रिया यात्रा',
    stepGate: 'गेट प्रवेश',
    stepCounter: 'दस्तावेज़ सत्यापन',
    stepWeighbridge: 'तौल कांटा (IS 9281)',
    stepQuality: 'गुणवत्ता परख',
    stepPayment: 'PFMS डीबीटी भुगतान',
    currentStageBadge: 'वर्तमान चरण',
    stageCompletedBadge: 'पूर्ण',
    stagePendingBadge: 'आगामी',

    listenAudio: 'विवरण सुनें',
    directions: 'मार्ग व नक्शा',
    reschedule: 'स्लॉट बदलें',
    cancelBooking: 'बुकिंग रद्द करें',
    confirmAction: 'पुष्टि करें',
    close: 'बंद करें',
    submit: 'जमा करें',
    back: 'पीछे',
    next: 'आगे बढ़ें',

    liveQueueTitle: 'लाइव कतार स्थिति एवं प्रवेश पास',
    digitalPassTitle: 'प्राधिकृत डिजिटल ई-पास',
    offlinePassNotice: 'यह पास बिना इंटरनेट भी मंडी गेट स्कैनर द्वारा मान्य है',
    qrInstruction: 'मंडी प्रवेश द्वार पर ANPR गेट कैमरे या स्कैनर के समक्ष यह कोड दिखाएं',
    counterAssignedLabel: 'आबंटित काउंटर',
    syncTimestamp: 'अंतिम सिंक समय',

    weighbridgeTitle: 'इलेक्ट्रॉनिक तौल पर्ची (IS 9281 प्रमाणित)',
    slipNumberLabel: 'तौल पर्ची संख्या',
    grossWeight: 'कुल सकल भार (Gross)',
    tareWeight: 'वाहन भार (Tare)',
    netWeight: 'शुद्ध फसल उपज भार (Net)',
    moisturePercent: 'नमी का प्रतिशत',
    foreignMatter: 'अपद्रव्य / कचरा',
    qualityGrade: 'गुणवत्ता ग्रेड',
    mspRate: 'न्यूनतम समर्थन मूल्य (MSP)',
    totalPayable: 'कुल देय सरकारी राशि',
    downloadSlip: 'तौल पर्ची डाउनलोड करें',

    dbtTitle: 'PFMS / NPCI आधार प्रत्यक्ष लाभ अंतरण (DBT)',
    npciNotice: 'आधार पेमेंट ब्रिज सिस्टम (APBS) बैंक खाते में सीधा अंतरण',
    bankAccount: 'पंजीकृत बैंक खाता',
    utrNumber: 'बैंक यूटीआर / संदर्भ संख्या',
    statusCredited: 'बैंक खाते में सफलतापूर्वक जमा',
    statusProcessing: 'आरबीआई / एनपीसीआई द्वारा प्रक्रियाधीन',
    totalReceived: 'इस सत्र में प्राप्त कुल भुगतान',
    pendingClearance: 'समाशोधन प्रक्रियाधीन',

    profileTitle: 'किसान प्रोफ़ाइल व सरकारी रिकॉर्ड',
    landRecordsTitle: 'डिजिटाइज्ड भूमि विवरण (डिजिटल 7/12 खतौनी)',
    khasraNumber: 'खसरा / गट क्रमांक',
    parcelArea: 'रकबा (एकड़)',
    cropSeason: 'फसल सत्र',
    soilHealthCard: 'मृदा स्वास्थ्य कार्ड',

    kisanMitraTitle: 'किसान मित्र सहायता केंद्र',
    kisanMitraSubtitle: 'आपकी वास्तविक बुकिंग व तौल रिकॉर्ड पर आधारित विश्वसनीय सहायक',
    askQuestionPlaceholder: 'स्लॉट, कतार, भुगतान या मौसम के बारे में पूछें...',
    quickCheckBooking: 'मेरी बुकिंग स्थिति',
    quickCheckQueue: 'मेरी कतार स्थिति',
    quickCheckCentre: 'उपार्जन केंद्र का पता',
    quickCheckPayment: 'डीबीटी भुगतान की स्थिति',
    quickCheckProcurement: 'फसल तौल पर्ची विवरण',
    callSupportAction: 'टोल-फ्री नंबर 1800-180-1551 पर कॉल करें',

    loading: 'उपार्जन रिकॉर्ड लोड हो रहा है...',
    errorGeneric: 'लाइव डेटा अपडेट नहीं हो सका। स्थानीय ऑफ़लाइन रिकॉर्ड प्रदर्शित है।',
    retry: 'पुनः प्रयास करें',

    logoutButton: 'लॉगआउट करें व मुख्य पोर्टल पर लौटें',
    lockTerminalButton: 'टर्मिनल लॉक करें / सत्र समाप्त करें',
    clearSessionAndLogout: 'सत्र साफ़ करें व लॉगआउट करें',
    clearSessionDesc: 'यह सक्रिय सत्र डेटा को सुरक्षित रूप से साफ़ करेगा, स्थानीय प्रमाणीकरण रीसेट करेगा और बिना किसी संवेदनशील परिचालन डेटा को सहेजे सार्वजनिक पृष्ठ पर वापस ले जाएगा।',
    clearSessionConfirm: 'क्या आप सुनिश्चित हैं कि आप सत्र साफ़ करके लॉगआउट करना चाहते हैं?',
    confirmLogout: 'हाँ, सत्र साफ़ करें व लॉगआउट करें',
    cancel: 'रद्द करें',
    sessionActiveStatus: 'सत्र सक्रिय एवं प्रमाणित',
    securityClearance: 'सुरक्षा स्तर',
    changePinAction: 'टर्मिनल पिन बदलें',
    quickReportTitle: 'त्वरित पाली परिचालन रिपोर्ट',
    hourlyPacingTitle: 'घंटेवार समयबद्ध परिचालन रिपोर्ट',
    verifiedDocumentWorkflow: 'सत्यापित दस्तावेज़ आवक प्रक्रिया',

    // Portal Landing Gateway
    landingPortalTag: 'स्मार्ट प्रोक्योरमेंट ऑर्केस्ट्रेशन • आधिकारिक पोर्टल',
    landingMainTitle: 'कृषि उपज उपार्जन व मंडी प्रबंधन प्रणाली',
    landingSubtitle: 'पारदर्शी डिजिटल टोकन, कतार प्रबंधन, इलेक्ट्रॉनिक धर्मकांटा तौल एवं प्रत्यक्ष लाभ अंतरण (DBT) हेतु अपनी भूमिका के अनुसार लॉगिन करें।',
    roleFarmerCitizenService: 'नागरिक सेवा',
    roleFarmerTitle: 'किसान लॉगिन',
    roleFarmerDesc: 'आधार नंबर, पंजीकृत मोबाइल या ईमेल और 4-अंकीय सुरक्षा पिन द्वारा तुरंत लॉगिन करें।',
    roleFarmerB1: 'डिजिटल कतार व ई-पास',
    roleFarmerB2: 'तौल पर्ची व एमएसपी गणना',
    roleFarmerB3: 'प्रत्यक्ष डीबीटी बैंक भुगतान',
    roleFarmerBtn: 'किसान लॉगिन करें',
    roleSupervisorService: 'मंडी परिचालन',
    roleSupervisorTitle: 'पर्यवेक्षक टर्मिनल',
    roleSupervisorDesc: 'मंडी अधिकारी आईडी व 4-अंकीय टर्मिनल पिन द्वारा सुरक्षित केंद्र परिचालन।',
    roleSupervisorB1: 'इलेक्ट्रॉनिक धर्मकांटा सत्यापन',
    roleSupervisorB2: 'टोकन कॉलिंग व कतार नियंत्रण',
    roleSupervisorB3: 'क्वालिटी रिजेक्शन व री-टेस्ट',
    roleSupervisorBtn: 'पर्यवेक्षक प्रमाणीकरण',
    roleAdminService: 'राज्य नीति प्राधिकरण',
    roleAdminTitle: 'सुपर एडमिन कंसोल',
    roleAdminDesc: 'राज्य कृषि आयुक्त व नीति नियंत्रक हेतु अधिकृत पासफ्रेज प्रमाणीकरण।',
    roleAdminB1: 'राज्य-स्तरीय उपार्जन निगरानी',
    roleAdminB2: 'आपातकालीन स्लॉट व कोटा विन्यास',
    roleAdminB3: 'अपरिवर्तनीय ऑडिट लॉग',
    roleAdminBtn: 'प्रशासनिक प्रवेश',
    sihModeBadge: 'मूल्यांकन / जूरी परीक्षण',
    sihModeDesc: 'हैकथॉन जूरी मूल्यांकन हेतु पूर्व-कॉन्फ़िगर किए गए 3 भूमिका क्रेडेंशियल उपलब्ध हैं।',
    demoDrawerBtn: 'डेमो क्रेडेंशियल डायरेक्टरी',

    // Header & General Labels
    mandiLocation: 'वर्धा मॉडल उपार्जन केंद्र (विदर्भ संभाग)',
    gatewayHome: 'पोर्टल मुख्य पृष्ठ',
    portalGateway: 'प्रवेश द्वार',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    kisanLogin: 'किसान लॉगिन',
    signOut: 'लॉगआउट',
    stationProfile: 'केंद्र प्रोफ़ाइल',
    lockExit: 'लॉक / बाहर जाएं',
    returnToPortalGateway: 'मुख्य द्वार पर वापस जाएं',
    switchLightMode: 'लाइट मोड में बदलें',
    switchDarkMode: 'डार्क मोड में बदलें'
  },

  mr: {
    brandName: 'एस.पी.ओ — स्मार्ट प्रोक्योरमेंट ऑर्केस्ट्रेशन',
    brandTagline: 'कृषी व शेतकरी कल्याण विभाग • भारत सरकार',
    govtMinistry: 'कृषी व शेतकरी कल्याण मंत्रालय (NeGPA)',
    tollFree: '1800-180-1551',
    tollFreeLabel: 'शेतकरी हेल्पलाइन (टोल-फ्री)',
    onlineSync: 'क्लाउड थेट सिंक',
    offlineCached: 'ऑफलाइन: ई-पास स्थानिक कॅशमध्ये सुरक्षित',
    outdoorMode: 'शेत / ऊन मोड',
    outdoorModeActive: 'उच्च कॉन्ट्रास्ट सक्रिय',
    languageSelect: 'भाषा निवडा',

    navHome: 'मुख्य पान',
    navBooking: 'माझे बुकिंग',
    navQueue: 'रांग / ई-पास',
    navProcurement: 'खरेदी स्थिती',
    navPayments: 'डीबीटी पेमेंट्स',
    navNotifications: 'सूचना',
    navProfile: 'माझे प्रोफाइल',
    navHelp: 'मदत व शेतकरी मित्र',

    greeting: 'नमस्कार,',
    kisanId: 'शेतकरी आयडी',
    ekycVerified: 'आधार e-KYC प्रमाणित',
    farmlandTotal: 'एकर एकूण शेतजमीन',
    weatherAdvisory: 'हवामान अनुकूल, बाजार समिती आवक व फवारणीसाठी योग्य',

    todayAppointmentTitle: 'आजचे नियोजित टोकन व सक्रिय स्लॉट',
    noActiveAppointment: 'आज कोणतीही सक्रिय बुकिंग नाही',
    noActiveAppointmentDesc: 'सध्या आजच्या तारखेसाठी आपले कोणतेही खरेदी आरक्षण नाही. आपण पुढील तारखेसाठी नवीन स्लॉट बुक करू शकता.',
    bookNewSlotButton: 'नवीन खरेदी स्लॉट बुक करा',
    tokenNumber: 'टोकन / ई-पास क्रमांक',
    bookingDate: 'बुकिंग तारीख',
    slotTime: 'वेळेची खिडकी',
    centreName: 'खरेदी केंद्र',
    currentStatus: 'सद्य स्थिती',
    expectedArrival: 'अपेक्षित आगमन',
    reachByDeadline: 'केंद्रावर पोहोचण्याची वेळ',
    remainingTime: 'उर्वरित वेळ',
    queuePositionLabel: 'रांगेतील क्रमांक',
    peopleAheadLabel: 'आपल्या पुढे शेतकरी',
    estimatedWaitLabel: 'अपेक्षित प्रतीक्षा',
    cropLabel: 'शेतमाल पीक',
    bookedQuantityLabel: 'नोंदणीकृत प्रमाण',
    remainingQuantityLabel: 'उर्वरित प्रक्रिया प्रमाण',
    primaryNextAction: 'पुढील आवश्यक कृती',
    actionViewPass: 'डिजिटल पास व बारकोड उघडा',
    actionProceedGate: 'मार्केट यार्ड मुख्य प्रवेशद्वाराकडे जा',
    actionReportCounter: 'पडताळणी काउंटरवर जा',
    actionViewWeighment: 'इलेक्ट्रॉनिक वजन पावती पहा',
    actionTrackPayment: 'डीबीटी बँक जमा स्थिती तपासा',

    summaryTitle: 'आजचा संक्षिप्त आढावा',
    summaryQueue: 'रांगेतील स्थान',
    summaryProcurement: 'वजन स्थिती',
    summaryPayment: 'डीबीटी स्थिती',
    summaryAlerts: 'सक्रिय सूचना',

    journeyTitle: 'खरेदी प्रक्रिया प्रवास',
    stepGate: 'गेट आवक',
    stepCounter: 'कागदपत्र पडताळणी',
    stepWeighbridge: 'धर्मकाटा वजन (IS 9281)',
    stepQuality: 'गुणवत्ता तपासणी',
    stepPayment: 'PFMS डीबीटी जमा',
    currentStageBadge: 'सध्याचा टप्पा',
    stageCompletedBadge: 'पूर्ण',
    stagePendingBadge: 'आगामी',

    listenAudio: 'माहिती ऐका',
    directions: 'मार्ग व नकाशा',
    reschedule: 'स्लॉट बदला',
    cancelBooking: 'बुकिंग रद्द करा',
    confirmAction: 'निश्चित करा',
    close: 'बंद करा',
    submit: 'सादर करा',
    back: 'मागे',
    next: 'पुढे जा',

    liveQueueTitle: 'थेट रांग स्थिती व गेट पास',
    digitalPassTitle: 'अधिकृत डिजिटल ई-पास',
    offlinePassNotice: 'हा पास इंटरनेट नसतानाही गेट स्कॅनरद्वारे वैध आहे',
    qrInstruction: 'प्रवेशद्वारावर ANPR कॅमेरा किंवा स्कॅनरसमोर हा क्यूआर कोड दाखवा',
    counterAssignedLabel: 'नेमलेला काउंटर',
    syncTimestamp: 'शेवटचा सिंक वेळ',

    weighbridgeTitle: 'इलेक्ट्रॉनिक वजन पावती (IS 9281 प्रमाणित)',
    slipNumberLabel: 'पावती क्रमांक',
    grossWeight: 'एकूण वजन (Gross)',
    tareWeight: 'वाहन वजन (Tare)',
    netWeight: 'निव्वळ पीक वजन (Net)',
    moisturePercent: 'ओलाव्याचे प्रमाण',
    foreignMatter: 'कचरा / अपद्रव्य',
    qualityGrade: 'गुणवत्ता प्रत',
    mspRate: 'हमीभाव (MSP)',
    totalPayable: 'एकूण देय सरकारी रक्कम',
    downloadSlip: 'वजन पावती डाउनलोड करा',

    dbtTitle: 'PFMS / NPCI थेट बँक हस्तांतरण (DBT)',
    npciNotice: 'आधार पेमेंट ब्रिज सिस्टीम (APBS) थेट बँक खात्यात जमा',
    bankAccount: 'नोंदणीकृत बँक खाते',
    utrNumber: 'बँकिंग UTR संदर्भ',
    statusCredited: 'बँक खात्यात जमा झाले',
    statusProcessing: 'प्रक्रिया सुरू आहे',
    totalReceived: 'या हंगामात मिळालेली एकूण रक्कम',
    pendingClearance: 'मंजुरी प्रलंबित',

    profileTitle: 'शेतकरी प्रोफाइल व 7/12 रेकॉर्ड',
    landRecordsTitle: 'डिजिटलाइझ शेतजमीन (डिजिटल 7/12 उतारा)',
    khasraNumber: 'गट / सर्व्हे क्रमांक',
    parcelArea: 'क्षेत्रफळ (एकर)',
    cropSeason: 'हंगाम',
    soilHealthCard: 'मृदा आरोग्य पत्रिका',

    kisanMitraTitle: 'शेतकरी मित्र सहाय्यता केंद्र',
    kisanMitraSubtitle: 'आपल्या प्रत्यक्ष नोंदींवर आधारित विश्वासू सहाय्यक',
    askQuestionPlaceholder: 'स्लॉट, रांग, हमीभाव किंवा हवामानाबद्दल विचारा...',
    quickCheckBooking: 'माझे बुकिंग तपासा',
    quickCheckQueue: 'रांगेतील जागा तपासा',
    quickCheckCentre: 'खरेदी केंद्राचा पत्ता',
    quickCheckPayment: 'डीबीटी पेमेंट स्थिती',
    quickCheckProcurement: 'वजन पावती तपशील',
    callSupportAction: 'टोल-फ्री १८००-१८०-१५५१ वर कॉल करा',

    loading: 'माहिती लोड होत आहे...',
    errorGeneric: 'माहिती अद्ययावत करता आली नाही. ऑफलाइन कॅश दाखवत आहे.',
    retry: 'पुन्हा प्रयत्न करा',

    logoutButton: 'लॉगआउट करा व मुख्य पोर्टलवर जा',
    lockTerminalButton: 'टर्मिनल लॉक करा',
    clearSessionAndLogout: 'सत्र साफ करा व लॉगआउट करा',
    clearSessionDesc: 'हे सक्रिय सत्र डेटा सुरक्षितपणे पुसून टाकेल आणि सार्वजनिक पानावर परत नेईल.',
    clearSessionConfirm: 'तुम्ही सत्र साफ करून लॉगआउट करू इच्छिता का?',
    confirmLogout: 'होय, सत्र साफ करा',
    cancel: 'रद्द करा',
    sessionActiveStatus: 'सत्र सक्रिय व प्रमाणित',
    securityClearance: 'सुरक्षा स्तर',
    changePinAction: 'टर्मिनल पिन बदला',
    quickReportTitle: 'त्वरित शिफ्ट अहवाल',
    hourlyPacingTitle: 'तासनिहाय प्रगती अहवाल',
    verifiedDocumentWorkflow: 'प्रमाणित दस्तऐवज आवक प्रक्रिया',

    // Portal Landing Gateway
    landingPortalTag: 'स्मार्ट प्रोक्योरमेंट ऑर्केस्ट्रेशन • अधिकृत पोर्टल',
    landingMainTitle: 'कृषी शेतमाल खरेदी व बाजार समिती व्यवस्थापन प्रणाली',
    landingSubtitle: 'पारदर्शक डिजिटल टोकन, रांग व्यवस्थापन, इलेक्ट्रॉनिक धर्मकाटा वजन व थेट बँक हस्तांतरणासाठी (DBT) लॉग इन करा.',
    roleFarmerCitizenService: 'नागरिक सेवा',
    roleFarmerTitle: 'शेतकरी पोर्टल',
    roleFarmerDesc: 'आधार क्रमांक, नोंदणीकृत मोबाईल किंवा ईमेल आणि 4-अंकी पिनद्वारे त्वरित लॉग इन करा.',
    roleFarmerB1: 'डिजिटल रांग व ई-पास',
    roleFarmerB2: 'वजन पावती व हमीभाव हिशोब',
    roleFarmerB3: 'थेट बँक खात्यात डीबीटी जमा',
    roleFarmerBtn: 'शेतकरी लॉगिन',
    roleSupervisorService: 'मार्केट यार्ड संचलन',
    roleSupervisorTitle: 'पर्यवेक्षक टर्मिनल',
    roleSupervisorDesc: 'आवक नोंद, धर्मकाटा पडताळणी आणि थेट वजन पावती स्वीकृती.',
    roleSupervisorB1: 'इलेक्ट्रॉनिक धर्मकाटा वजन',
    roleSupervisorB2: 'टोकन कॉलिंग व रांग नियंत्रण',
    roleSupervisorB3: 'गुणवत्ता तपासणी व ऑडिट',
    roleSupervisorBtn: 'पर्यवेक्षक प्रमाणीकरण',
    roleAdminService: 'राज्य धोरण प्रशासन',
    roleAdminTitle: 'राज्य प्रशासन कन्सोल',
    roleAdminDesc: 'जिल्हास्तरीय कोटा नियोजन, हमीभाव नियम आणि राज्यव्यापी खरेदी विश्लेषण.',
    roleAdminB1: 'राज्यस्तरीय खरेदी विश्लेषण',
    roleAdminB2: 'गतिमान कोटा व हमीभाव नियम',
    roleAdminB3: 'अपरिवर्तनीय ऑडिट नोंदी',
    roleAdminBtn: 'प्रशासकीय प्रवेश',
    sihModeBadge: 'मूल्यांकन / ज्युरी मोड',
    sihModeDesc: 'चाचणीसाठी ३ भूमिकांचे डेमो क्रेडेंशियल्स डायरेक्टरीमध्ये उपलब्ध आहेत.',
    demoDrawerBtn: 'डेमो क्रेडेंशियल डायरेक्टरी',

    // Header & General Labels
    mandiLocation: 'वर्धा मॉडेल खरेदी केंद्र (विदर्भ विभाग)',
    gatewayHome: 'मुख्य पोर्टल',
    portalGateway: 'प्रवेशद्वार',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    kisanLogin: 'शेतकरी लॉगिन',
    signOut: 'लॉगआउट',
    stationProfile: 'केंद्र प्रोफाइल',
    lockExit: 'लॉक / बाहेर पडा',
    returnToPortalGateway: 'मुख्य पोर्टलवर परत जा',
    switchLightMode: 'लाइट मोड निवडा',
    switchDarkMode: 'डार्क मोड निवडा'
  },

  pa: {
    brandName: 'ਐਸ.ਪੀ.ਓ — ਸਮਾਰਟ ਖਰੀਦ ਆਰਕੈਸਟ੍ਰੇਸ਼ਨ',
    brandTagline: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ ਵਿਭਾਗ • ਭਾਰਤ ਸਰਕਾਰ',
    govtMinistry: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਭਲਾਈ ਮੰਤਰਾਲਾ (NeGPA)',
    tollFree: '1800-180-1551',
    tollFreeLabel: 'ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ (ਟੋਲ-ਫ੍ਰੀ)',
    onlineSync: 'ਕਲਾਉਡ ਲਾਈਵ ਸਿੰਕ',
    offlineCached: 'ਔਫਲਾਈਨ: ਈ-ਪਾਸ ਸਥਾਨਕ ਕੈਸ਼ ਵਿੱਚ ਸੁਰੱਖਿਅਤ',
    outdoorMode: 'ਖੇਤ / ਧੁੱਪ ਮੋਡ',
    outdoorModeActive: 'ਹਾਈ ਕੰਟਰਾਸਟ ਸਰਗਰਮ',
    languageSelect: 'ਭਾਸ਼ਾ ਚੁਣੋ',

    navHome: 'ਮੁੱਖ ਪੰਨਾ',
    navBooking: 'ਮੇਰੀ ਬੁਕਿੰਗ',
    navQueue: 'ਕਤਾਰ / ਈ-ਪਾਸ',
    navProcurement: 'ਖਰੀਦ ਸਥਿਤੀ',
    navPayments: 'ਡੀਬੀਟੀ ਭੁਗਤਾਨ',
    navNotifications: 'ਸੂਚਨਾਵਾਂ',
    navProfile: 'ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ',
    navHelp: 'ਮਦਦ ਅਤੇ ਕਿਸਾਨ ਮਿੱਤਰ',

    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ,',
    kisanId: 'ਕਿਸਾਨ ਆਈਡੀ',
    ekycVerified: 'ਆਧਾਰ e-KYC ਪ੍ਰਮਾਣਿਤ',
    farmlandTotal: 'ਏਕੜ ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ',
    weatherAdvisory: 'ਮੌਸਮ ਅਨੁਕੂਲ, ਮੰਡੀ ਆਮਦ ਅਤੇ ਸਪਰੇਅ ਲਈ ਢੁਕਵਾਂ',

    todayAppointmentTitle: 'ਅੱਜ ਦਾ ਨਿਰਧਾਰਿਤ ਖਰੀਦ ਸਲਾਟ',
    noActiveAppointment: 'ਅੱਜ ਲਈ ਕੋਈ ਸਰਗਰਮ ਸਲਾਟ ਨਹੀਂ ਹੈ',
    noActiveAppointmentDesc: 'ਅੱਜ ਦੀ ਮਿਤੀ ਲਈ ਤੁਹਾਡੀ ਕੋਈ ਸਰਗਰਮ ਖਰੀਦ ਬੁਕਿੰਗ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਅਗਲੀ ਮਿਤੀ ਲਈ ਨਵਾਂ ਸਲਾਟ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ।',
    bookNewSlotButton: 'ਨਵਾਂ ਖਰੀਦ ਸਲਾਟ ਬੁੱਕ ਕਰੋ',
    tokenNumber: 'ਟੋਕਨ / ਈ-ਪਾਸ ਨੰਬਰ',
    bookingDate: 'ਬੁਕਿੰਗ ਮਿਤੀ',
    slotTime: 'ਸਮਾਂ ਵਿੰਡੋ',
    centreName: 'ਖਰੀਦ ਕੇਂਦਰ',
    currentStatus: 'ਮੌਜੂਦਾ ਸਥਿਤੀ',
    expectedArrival: 'ਸੰਭਾਵਿਤ ਆਮਦ',
    reachByDeadline: 'ਕੇਂਦਰ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ',
    remainingTime: 'ਬਾਕੀ ਸਮਾਂ',
    queuePositionLabel: 'ਕਤਾਰ ਵਿਚ ਸਥਾਨ',
    peopleAheadLabel: 'ਤੁਹਾਡੇ ਤੋਂ ਅੱਗੇ ਕਿਸਾਨ',
    estimatedWaitLabel: 'ਅੰਦਾਜ਼ਨ ਉਡੀਕ ਸਮਾਂ',
    cropLabel: 'ਫਸਲ ਉਪਜ',
    bookedQuantityLabel: 'ਰਜਿਸਟਰਡ ਮਾਤਰਾ',
    remainingQuantityLabel: 'ਬਾਕੀ ਬਚੀ ਮਾਤਰਾ',
    primaryNextAction: 'ਅਗਲਾ ਜ਼ਰੂਰੀ ਕਦਮ',
    actionViewPass: 'ਡਿਜੀਟਲ ਪਾਸ ਤੇ ਬਾਰਕੋਡ ਵੇਖੋ',
    actionProceedGate: 'ਮੰਡੀ ਮੁੱਖ ਗੇਟ ਵੱਲ ਵਧੋ',
    actionReportCounter: 'ਪੜਤਾਲ ਕਾਊਂਟਰ ਤੇ ਜਾਓ',
    actionViewWeighment: 'ਕੰਪਿਊਟਰਾਈਜ਼ਡ ਕੰਡਾ ਪਰਚੀ ਵੇਖੋ',
    actionTrackPayment: 'ਡੀਬੀਟੀ ਬੈਂਕ ਜਮ੍ਹਾ ਸਥਿਤੀ ਵੇਖੋ',

    summaryTitle: 'ਅੱਜ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਸਾਰ',
    summaryQueue: 'ਕਤਾਰ ਦਰਜਾ',
    summaryProcurement: 'ਤੋਲ ਸਥਿਤੀ',
    summaryPayment: 'ਡੀਬੀਟੀ ਭੁਗਤਾਨ',
    summaryAlerts: 'ਸਰਗਰਮ ਸੂਚਨਾਵਾਂ',

    journeyTitle: 'ਖਰੀਦ ਪ੍ਰਕਿਰਿਆ ਸਫ਼ਰ',
    stepGate: 'ਗੇਟ ਦਾਖਲਾ',
    stepCounter: 'ਦਸਤਾਵੇਜ਼ ਪੜਤਾਲ',
    stepWeighbridge: 'ਧਰਮ ਕੰਡਾ ਤੋਲ (IS 9281)',
    stepQuality: 'ਗੁਣਵੱਤਾ ਪਰਖ',
    stepPayment: 'PFMS ਡੀਬੀਟੀ ਕ੍ਰੈਡਿਟ',
    currentStageBadge: 'ਮੌਜੂਦਾ ਪੜਾਅ',
    stageCompletedBadge: 'ਮੁਕੰਮਲ',
    stagePendingBadge: 'ਅਗਲਾ',

    listenAudio: 'ਵੇਰਵੇ ਸੁਣੋ',
    directions: 'ਰਸਤਾ ਅਤੇ ਨਕਸ਼ਾ',
    reschedule: 'ਸਲਾਟ ਬਦਲੋ',
    cancelBooking: 'ਬੁਕਿੰਗ ਰੱਦ ਕਰੋ',
    confirmAction: 'ਪੁਸ਼ਟੀ ਕਰੋ',
    close: 'ਬੰਦ ਕਰੋ',
    submit: 'ਜਮ੍ਹਾ ਕਰੋ',
    back: 'ਪਿੱਛੇ',
    next: 'ਅੱਗੇ',

    liveQueueTitle: 'ਲਾਈਵ ਕਤਾਰ ਅਤੇ ਗੇਟ ਐਂਟਰੀ ਪਾਸ',
    digitalPassTitle: 'ਅਧਿਕਾਰਤ ਡਿਜੀਟਲ ਈ-ਪਾਸ',
    offlinePassNotice: 'ਇਹ ਪਾਸ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਦੇ ਵੀ ਗੇਟ ਸਕੈਨਰ ਦੁਆਰਾ ਮੰਨਣਯੋਗ ਹੈ',
    qrInstruction: 'ਗੇਟ ਤੇ ANPR ਕੈਮਰੇ ਜਾਂ ਸਕੈਨਰ ਸਾਹਮਣੇ ਇਹ ਕੋਡ ਦਿਖਾਓ',
    counterAssignedLabel: 'ਅਲਾਟ ਕੀਤਾ ਕਾਊਂਟਰ',
    syncTimestamp: 'ਆਖਰੀ ਸਿੰਕ ਸਮਾਂ',

    weighbridgeTitle: 'ਇਲੈਕਟ੍ਰਾਨਿਕ ਕੰਡਾ ਪਰਚੀ (IS 9281)',
    slipNumberLabel: 'ਪਰਚੀ ਨੰਬਰ',
    grossWeight: 'ਕੁੱਲ ਵਜ਼ਨ (Gross)',
    tareWeight: 'ਵਾਹਨ ਵਜ਼ਨ (Tare)',
    netWeight: 'ਸ਼ੁੱਧ ਫਸਲ ਵਜ਼ਨ (Net)',
    moisturePercent: 'ਨਮੀ ਦੀ ਮਾਤਰਾ',
    foreignMatter: 'ਕੂੜਾ / ਫ਼ਾਲਤੂ ਪਦਾਰਥ',
    qualityGrade: 'ਗੁਣਵੱਤਾ ਗ੍ਰੇਡ',
    mspRate: 'ਸਰਕਾਰੀ ਸਮਰਥਨ ਮੁੱਲ (MSP)',
    totalPayable: 'ਕੁੱਲ ਦੇਣਯੋਗ ਰਕਮ',
    downloadSlip: 'ਤੋਲ ਪਰਚੀ ਡਾਊਨਲੋਡ ਕਰੋ',

    dbtTitle: 'PFMS / NPCI ਸਿੱਧਾ ਲਾਭ ਤਬਾਦਲਾ (DBT)',
    npciNotice: 'ਆਧਾਰ ਪੇਮੈਂਟ ਬ੍ਰਿਜ ਸਿਸਟਮ ਰਾਹੀਂ ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾ',
    bankAccount: 'ਰਜਿਸਟਰਡ ਬੈਂਕ ਖਾਤਾ',
    utrNumber: 'ਬੈਂਕ UTR ਨੰਬਰ',
    statusCredited: 'ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾ',
    statusProcessing: 'ਪ੍ਰਕਿਰਿਆ ਅਧੀਨ ਹੈ',
    totalReceived: 'ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਪ੍ਰਾਪਤ ਕੁੱਲ ਭੁਗਤਾਨ',
    pendingClearance: 'ਮਨਜ਼ੂਰੀ ਬਾਕੀ ਹੈ',

    profileTitle: 'ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ',
    landRecordsTitle: 'ਡਿਜੀਟਾਈਜ਼ਡ ਜ਼ਮੀਨ ਵੇਰਵੇ (ਜਮ੍ਹਾਂਬੰਦੀ)',
    khasraNumber: 'ਖਸਰਾ / ਮੁਰੱਬਾ ਨੰਬਰ',
    parcelArea: 'ਰਕਬਾ (ਏਕੜ)',
    cropSeason: 'ਸੀਜ਼ਨ',
    soilHealthCard: 'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ',

    kisanMitraTitle: 'ਕਿਸਾਨ ਮਿੱਤਰ ਸਹਾਇਤਾ ਕੇਂਦਰ',
    kisanMitraSubtitle: 'ਤੁਹਾਡੇ ਅਸਲ ਰਿਕਾਰਡਾਂ ਤੇ ਆਧਾਰਿਤ ਭਰੋਸੇਯੋਗ ਸਹਾਇਕ',
    askQuestionPlaceholder: 'ਸਲਾਟ, ਕਤਾਰ, ਭੁਗਤਾਨ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...',
    quickCheckBooking: 'ਮੇਰੀ ਬੁਕਿੰਗ ਵੇਖੋ',
    quickCheckQueue: 'ਮੇਰੀ ਕਤਾਰ ਵੇਖੋ',
    quickCheckCentre: 'ਖਰੀਦ ਕੇਂਦਰ ਦਾ ਪਤਾ',
    quickCheckPayment: 'ਡੀਬੀਟੀ ਭੁਗਤਾਨ ਸਥਿਤੀ',
    quickCheckProcurement: 'ਤੋਲ ਪਰਚੀ ਵੇਰਵੇ',
    callSupportAction: 'ਟੋਲ-ਫ੍ਰੀ 1800-180-1551 ਤੇ ਕਾਲ ਕਰੋ',

    loading: 'ਰਿਕਾਰਡ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...',
    errorGeneric: 'ਡੇਟਾ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਔਫਲਾਈਨ ਰਿਕਾਰਡ ਦਿਖਾਇਆ ਜਾ ਰਿਹਾ ਹੈ।',
    retry: 'ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ',

    logoutButton: 'ਲੌਗਆਉਟ ਕਰੋ ਤੇ ਪੋਰਟਲ ਤੇ ਵਾਪਸ ਜਾਓ',
    lockTerminalButton: 'ਟਰਮੀਨਲ ਲੌਕ ਕਰੋ',
    clearSessionAndLogout: 'ਸੈਸ਼ਨ ਸਾਫ਼ ਕਰੋ ਤੇ ਲੌਗਆਉਟ ਕਰੋ',
    clearSessionDesc: 'ਇਹ ਸਰਗਰਮ ਸੈਸ਼ਨ ਡੇਟਾ ਨੂੰ ਸਾਫ਼ ਕਰ ਦੇਵੇਗਾ ਅਤੇ ਮੁੱਖ ਪੰਨੇ ਤੇ ਵਾਪਸ ਲੈ ਜਾਵੇਗਾ।',
    clearSessionConfirm: 'ਕੀ ਤੁਸੀਂ ਸੈਸ਼ਨ ਸਾਫ਼ ਕਰਕੇ ਲੌਗਆਉਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
    confirmLogout: 'ਹਾਂ, ਸੈਸ਼ਨ ਸਾਫ਼ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    sessionActiveStatus: 'ਸੈਸ਼ਨ ਸਰਗਰਮ ਅਤੇ ਪ੍ਰਮਾਣਿਤ',
    securityClearance: 'ਸੁਰੱਖਿਆ ਪੱਧਰ',
    changePinAction: 'ਟਰਮੀਨਲ ਪਿੰਨ ਬਦਲੋ',
    quickReportTitle: 'ਸ਼ਿਫਟ ਰਿਪੋਰਟ',
    hourlyPacingTitle: 'ਘੰਟੇਵਾਰ ਤਰੱਕੀ ਰਿਪੋਰਟ',
    verifiedDocumentWorkflow: 'ਪ੍ਰਮਾਣਿਤ ਦਸਤਾਵੇਜ਼ ਆਮਦ ਪ੍ਰਕਿਰਿਆ',

    // Portal Landing Gateway
    landingPortalTag: 'ਸਮਾਰਟ ਖਰੀਦ ਆਰਕੈਸਟ੍ਰੇਸ਼ਨ • ਅਧਿਕਾਰਤ ਪੋਰਟਲ',
    landingMainTitle: 'ਖੇਤੀਬਾੜੀ ਖਰੀਦ ਅਤੇ ਮੰਡੀ ਪ੍ਰਬੰਧਨ ਪ੍ਰਣਾਲੀ',
    landingSubtitle: 'ਪਾਰਦਰਸ਼ੀ ਡਿਜੀਟਲ ਟੋਕਨ, ਕਤਾਰ ਪ੍ਰਬੰਧਨ, ਧਰਮ ਕੰਡਾ ਤੋਲ ਅਤੇ ਸਿੱਧੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਭੁਗਤਾਨ (DBT) ਲਈ ਲੌਗਇਨ ਕਰੋ।',
    roleFarmerCitizenService: 'ਨਾਗਰਿਕ ਸੇਵਾ',
    roleFarmerTitle: 'ਕਿਸਾਨ ਪੋਰਟਲ',
    roleFarmerDesc: 'ਆਧਾਰ ਨੰਬਰ, ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਜਾਂ ਈਮੇਲ ਅਤੇ 4-ਅੰਕੀ ਪਿੰਨ ਰਾਹੀਂ ਤੁਰੰਤ ਲੌਗਇਨ ਕਰੋ।',
    roleFarmerB1: 'ਡਿਜੀਟਲ ਕਤਾਰ ਤੇ ਈ-ਪਾਸ',
    roleFarmerB2: 'ਤੋਲ ਪਰਚੀ ਤੇ ਸਮਰਥਨ ਮੁੱਲ ਹਿਸਾਬ',
    roleFarmerB3: 'ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਡੀਬੀਟੀ',
    roleFarmerBtn: 'ਕਿਸਾਨ ਲੌਗਇਨ',
    roleSupervisorService: 'ਮੰਡੀ ਸੰਚਾਲਨ',
    roleSupervisorTitle: 'ਸੁਪਰਵਾਈਜ਼ਰ ਟਰਮੀਨਲ',
    roleSupervisorDesc: 'ਵਾਹਨ ਆਮਦ ਲੌਗਿੰਗ, ਧਰਮ ਕੰਡਾ ਪੜਤਾਲ ਅਤੇ ਤੋਲ ਪਰਚੀ ਪ੍ਰਮਾਣੀਕਰਨ।',
    roleSupervisorB1: 'ਇਲੈਕਟ੍ਰਾਨਿਕ ਧਰਮ ਕੰਡਾ ਤੋਲ',
    roleSupervisorB2: 'ਟੋਕਨ ਕਾਲਿੰਗ ਤੇ ਕਤਾਰ ਪ੍ਰਬੰਧਨ',
    roleSupervisorB3: 'ਗੁਣਵੱਤਾ ਜਾਂਚ ਤੇ ਆਡਿਟ',
    roleSupervisorBtn: 'ਸੁਪਰਵਾਈਜ਼ਰ ਲੌਗਇਨ',
    roleAdminService: 'ਰਾਜ ਨੀਤੀ ਪ੍ਰਸ਼ਾਸਨ',
    roleAdminTitle: 'ਰਾਜ ਪ੍ਰਸ਼ਾਸਨ ਕੰਸੋਲ',
    roleAdminDesc: 'ਜ਼ਿਲ੍ਹਾ ਵਾਰ ਕੋਟਾ ਨਿਰਧਾਰਨ, ਐਮਰਜੈਂਸੀ ਓਵਰਰਾਈਡ ਅਤੇ ਰਾਜ ਪੱਧਰੀ ਖਰੀਦ ਵਿਸ਼ਲੇਸ਼ਣ।',
    roleAdminB1: 'ਰਾਜ ਪੱਧਰੀ ਖਰੀਦ ਵਿਸ਼ਲੇਸ਼ਣ',
    roleAdminB2: 'ਡਾਇਨਾਮਿਕ ਕੋਟਾ ਤੇ ਨਿਯਮ',
    roleAdminB3: 'ਸੁਰੱਖਿਅਤ ਆਡਿਟ ਲੌਗ',
    roleAdminBtn: 'ਪ੍ਰਸ਼ਾਸਕੀ ਪ੍ਰਵੇਸ਼',
    sihModeBadge: 'ਜਿਊਰੀ ਮੁਲਾਂਕਣ ਮੋਡ',
    sihModeDesc: 'ਜਿਊਰੀ ਮੁਲਾਂਕਣ ਲਈ 3 ਭੂਮਿਕਾਵਾਂ ਦੇ ਡੈਮੋ ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ ਡਾਇਰੈਕਟਰੀ ਵਿੱਚ ਉਪਲਬਧ ਹਨ।',
    demoDrawerBtn: 'ਡੈਮੋ ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ ਡਾਇਰੈਕਟਰੀ',

    // Header & General Labels
    mandiLocation: 'ਵਰਧਾ ਮਾਡਲ ਖਰੀਦ ਕੇਂਦਰ (ਵਿਦਰਭ ਜ਼ੋਨ)',
    gatewayHome: 'ਪੋਰਟਲ ਮੁੱਖ ਪੰਨਾ',
    portalGateway: 'ਗੇਟਵੇਅ',
    lightMode: 'ਲਾਈਟ ਮੋਡ',
    darkMode: 'ਡਾਰਕ ਮੋਡ',
    kisanLogin: 'ਕਿਸਾਨ ਲੌਗਇਨ',
    signOut: 'ਲੌਗਆਉਟ',
    stationProfile: 'ਕੇਂਦਰ ਪ੍ਰੋਫਾਈਲ',
    lockExit: 'ਲੌਕ / ਬਾਹਰ ਜਾਓ',
    returnToPortalGateway: 'ਮੁੱਖ ਪੋਰਟਲ ਤੇ ਵਾਪਸ ਜਾਓ',
    switchLightMode: 'ਲਾਈਟ ਮੋਡ ਚੁਣੋ',
    switchDarkMode: 'ਡਾਰਕ ਮੋਡ ਚੁਣੋ'
  }
};

export function getTranslations(lang: LanguageCode): AppTranslations {
  return I18N_RESOURCES[lang] || I18N_RESOURCES.en;
}
