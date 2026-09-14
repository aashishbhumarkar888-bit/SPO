/**
 * Centralized Internationalization (i18n) Engine for SPO
 * Comprehensive support for English and Hindi (Devanagari)
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
}

export const I18N_RESOURCES: Record<'en' | 'hi', AppTranslations> = {
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
    verifiedDocumentWorkflow: 'Verified Document Inward Workflow'
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
    verifiedDocumentWorkflow: 'सत्यापित दस्तावेज़ आवक प्रक्रिया'
  }
};

export function getTranslations(lang: LanguageCode): AppTranslations {
  if (lang === 'hi') return I18N_RESOURCES.hi;
  return I18N_RESOURCES.en;
}
