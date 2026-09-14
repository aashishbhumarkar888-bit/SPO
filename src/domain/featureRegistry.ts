/**
 * AgriSeva Centralized Feature & Integration Registry
 * 
 * Single authoritative source of truth for all SIH Technical Audit Features.
 * Individual screens must NOT manually redefine integration status or behaviors.
 */

import { IntegrationStatus, IntegrationStatusBadge } from './statusEnums';

export interface FeatureRegistryItem {
  featureId: string;
  name: string;
  state: IntegrationStatus;
  auditId: string;
  description: string;
  prototypeBehaviour: string;
  productionIntegration: string;
  security: string;
  offlineBehaviour: string;
  failureBehaviour: string;
  badgeTag: string;
  subsystem: 'Kisan Mitra' | 'Command Center' | 'Super Admin Governance';
  judgeFaq: {
    question: string;
    answer: string;
  };
}

export const SIH_FEATURE_REGISTRY: FeatureRegistryItem[] = [
  {
    featureId: 'AUD-01',
    auditId: 'AUD-01',
    name: 'Smart Slot Recommendation',
    state: 'LIVE',
    subsystem: 'Kisan Mitra',
    badgeTag: 'Client Algorithm',
    description: 'Dynamic scoring engine evaluating gate queue dwell, Kendra throughput, and agromet rain risk.',
    prototypeBehaviour: 'Fully executable in-browser heuristic algorithm evaluating live gate queue velocity, historical Kendra throughput rates, and 48-hour precipitation forecasts to compute optimal arrival windows.',
    productionIntegration: 'AgriSeva Center Orchestrator Pacing Service deployed on NIC/State Cloud edge nodes with ANPR vehicle inward cameras.',
    security: 'Zero external telemetry leakage; calculations execute client-side or on secured local edge node with signed tokens.',
    offlineBehaviour: 'Runs 100% offline using locally cached operational rules and default off-peak morning distribution curves.',
    failureBehaviour: 'Graceful fallback to first-come-first-served (FCFS) slot selection if heuristics cannot compute.',
    judgeFaq: {
      question: 'Is the slot recommendation engine actually executing live logic?',
      answer: 'LIVE — Yes, the heuristic scoring function executes directly in the prototype based on real-time token states and weather hazard indices.'
    }
  },
  {
    featureId: 'AUD-02',
    auditId: 'AUD-02',
    name: 'Net Weight Calculation (IS 9281)',
    state: 'LIVE',
    subsystem: 'Command Center',
    badgeTag: 'IS 9281 Net Tare Engine',
    description: 'Automated tare-deduction and moisture penalty curves according to Indian Standard 9281.',
    prototypeBehaviour: 'Fully operational inward calculation terminal taking gross and tare weighments, applying IS 9281 standards, checking moisture against FAQ (<12%) threshold, and applying tiered deductions.',
    productionIntegration: 'Direct RS-232 / Modbus serial interface to Mettler-Toledo or Avery Weigh-Tronix load cell indicator and digital moisture meter.',
    security: 'Immutable weighbridge audit trail; values locked once voucher is generated to eliminate human tampering.',
    offlineBehaviour: 'Local weighbridge slip buffer persists to browser IndexedDB/LocalStorage; prints physical thermal receipt with signed QR.',
    failureBehaviour: 'Manual tare weight slip backup mode requiring dual supervisor electronic override sign-off.',
    judgeFaq: {
      question: 'Does the weighbridge terminal really compute the deduction formulas?',
      answer: 'LIVE — Yes, the net weight, moisture penalty curve, and gross MSP payable formulas are fully executable and generate active records.'
    }
  },
  {
    featureId: 'AUD-03',
    auditId: 'AUD-03',
    name: 'Multilingual Voice Assistant (Kisan Mitra)',
    state: 'LIVE',
    subsystem: 'Kisan Mitra',
    badgeTag: 'Web Speech API',
    description: 'Bilingual conversational assistant grounded in actual farmer bookings, queue states, and land records.',
    prototypeBehaviour: 'Live browser speech synthesis (SpeechSynthesisUtterance) and speech recognition (webkitSpeechRecognition) supporting Hindi and English with structured live state retrieval.',
    productionIntegration: 'Bhashini / Indic Whisper ASR + AI Voice Bot deployed with low-latency SIP telephony bridge.',
    security: 'Audio streams are processed transiently in memory; never persisted to external cloud servers; sensitive actions require farmer confirmation.',
    offlineBehaviour: 'Speech synthesis uses on-device system voices and pre-rendered audio notification chimes.',
    failureBehaviour: 'Instant visual text transcript and one-tap quick topic action chips if speech recognition is unavailable.',
    judgeFaq: {
      question: 'Is the voice assistant connected to a remote AI voice server?',
      answer: 'LIVE — It executes natively in the browser via the W3C Web Speech API; grounded strictly in live domain state without hallucinating.'
    }
  },
  {
    featureId: 'AUD-04',
    auditId: 'AUD-04',
    name: 'Dynamic MSP Pricing & Policy Configuration',
    state: 'LIVE',
    subsystem: 'Super Admin Governance',
    badgeTag: 'State Policy Engine',
    description: 'Administrative control panel for MSP rates, moisture limits, and mechanization subsidies.',
    prototypeBehaviour: 'Operational administrative control panel where Super Admins adjust district MSP rates (₹/quintal), FAQ moisture tolerance levels, and mechanization subsidies with immediate state propagation.',
    productionIntegration: 'Maharashtra State Agriculture Marketing Board (MSAMB) / e-NAM gazetted policy distribution API.',
    security: 'Audit-logged administrative changes with cryptographic hash stamping and role-based permissions.',
    offlineBehaviour: 'Default Gazetted Kharif/Rabi Minimum Support Price schedule preserved in offline configuration schema.',
    failureBehaviour: 'Reverts to previous gazetted schedule if validation constraints fail.',
    judgeFaq: {
      question: 'Does changing the MSP in Super Admin actually change farmer calculations?',
      answer: 'LIVE — Yes, modifying MSP rates in the Super Admin governance panel updates the live application state and recalculates subsequent procurement vouchers.'
    }
  },
  {
    featureId: 'AUD-05',
    auditId: 'AUD-05',
    name: 'Digital Queue Pass & Inward Gate Stepper',
    state: 'SYNCED',
    subsystem: 'Kisan Mitra',
    badgeTag: 'Offline Available (PWA)',
    description: 'Synchronized 4-stage stepper token with QR verification and offline cache resilience.',
    prototypeBehaviour: 'Reactive synchronized state machine tracking token progress through 4 stages: Gate Inward → Counter Verification → Weighbridge → DBT Advice. Persists locally and synchronizes across roles.',
    productionIntegration: 'State-wide Redis WebSocket cluster with MQTT push notification broker and telecom SMS shortcode mirror.',
    security: 'Token QR embeds digital signature preventing fraudulent duplicate token presentations.',
    offlineBehaviour: 'Token remains 100% accessible and readable by gate barcode scanners even in total 4G dead zones.',
    failureBehaviour: 'Local token cache loaded automatically on startup; sync queue flushes on reconnect.',
    judgeFaq: {
      question: 'Is the queue token synchronized with a remote cloud server right now?',
      answer: 'SYNCED — The queue pass is synchronized across farmer and supervisor views via local state persistence, maintaining full offline validity without needing live internet.'
    }
  },
  {
    featureId: 'AUD-06',
    auditId: 'AUD-06',
    name: 'Direct Benefit Transfer (DBT) & PFMS Settlement',
    state: 'INTEGRATION_READY',
    subsystem: 'Kisan Mitra',
    badgeTag: 'PFMS / NPCI APB',
    description: 'Aadhaar Payment Bridge ledger, masked bank credentials, and automated payment advice slips.',
    prototypeBehaviour: 'Accurately models the Aadhaar Payment Bridge (APB) passbook, displaying masked bank accounts, real-time PFMS transaction ledger, UTR numbers, and automated payment advice slips generated by the weighbridge inward slip.',
    productionIntegration: 'Public Financial Management System (PFMS) REST API + National Payments Corporation of India (NPCI) Aadhaar Payment Bridge System (APBS) ISO 20022 XML interface.',
    security: 'Aadhaar numbers masked (UIDAI compliance); zero plaintext bank details exposed in transit.',
    offlineBehaviour: 'Generates an encrypted offline DBT Advice Voucher stored on the farmer device; queued for batch clearance once network resumes.',
    failureBehaviour: 'Automatic re-routing through PFMS fallback mandate queue if bank server times out.',
    judgeFaq: {
      question: 'Is PFMS actually connected and transferring real rupees right now?',
      answer: 'INTEGRATION-READY — The prototype demonstrates the passbook experience, transaction schema, and automated payment advice generation; production deployment requires authorized government PFMS/NPCI API access.'
    }
  },
  {
    featureId: 'AUD-07',
    auditId: 'AUD-07',
    name: 'Bhulekh 7/12 Land Records & Khasra Verification',
    state: 'INTEGRATION_READY',
    subsystem: 'Kisan Mitra',
    badgeTag: 'Mahabhulekh REST v3',
    description: 'Cadastral map records, Khasra survey numbers, crop quotas, and Soil Health Cards.',
    prototypeBehaviour: 'Demonstrates verified 7/12 land parcels, survey/khasra numbers, crop area validation, and Soil Health Card records linked to the farmer digital identity.',
    productionIntegration: 'Mahabhulekh Land Records API (Department of Revenue, Govt. of Maharashtra) via AgriStack Unified Farmer Interface (UFI).',
    security: 'Complies with Digital Personal Data Protection Act (DPDPA); land records read-only and restricted to authenticated farmer.',
    offlineBehaviour: 'Digitally signed 7/12 summary cached locally for 90 days; verified offline via QR code scanning.',
    failureBehaviour: 'Supervisor physical KCC / land revenue passbook manual verification with document camera capture.',
    judgeFaq: {
      question: 'Are you pulling live 7/12 records directly from the state revenue server?',
      answer: 'INTEGRATION-READY — The schema and UI reflect authentic Mahabhulekh RoR data contracts; live queries require state NIC revenue portal API whitelisting.'
    }
  },
  {
    featureId: 'AUD-08',
    auditId: 'AUD-08',
    name: 'IMD Agro-Meteorological Doppler Feed',
    state: 'INTEGRATION_READY',
    subsystem: 'Kisan Mitra',
    badgeTag: 'IMD Mausam REST',
    description: 'Localized precipitation risk forecasts, humidity indices, and harvesting advisories.',
    prototypeBehaviour: 'Displays localized weather cards, temperature (28°C Wardha), cloud cover, and harvesting/spraying advisories (optimal vs high-risk rain windows) integrated into the booking engine.',
    productionIntegration: 'India Meteorological Department (IMD) Mausam API + Gramin Krishi Mausam Sewa (GKMS) Agromet Advisory Service.',
    security: 'Public meteorological data; no private farmer data exchanged.',
    offlineBehaviour: 'Persists the last received 48-hour agromet bulletin; displays cached timestamp.',
    failureBehaviour: 'Uses district-level seasonal historical averages if real-time radar feed is unreachable.',
    judgeFaq: {
      question: 'Is the weather reading a live satellite Doppler connection?',
      answer: 'INTEGRATION-READY — The UI and recommendation engine integrate the data contract and hazard rules; production connection binds to the IMD Mausam API.'
    }
  },
  {
    featureId: 'AUD-09',
    auditId: 'AUD-09',
    name: 'Machinery Fleet Telemetry (AIS-140 GPS & Sensors)',
    state: 'INTEGRATION_READY',
    subsystem: 'Command Center',
    badgeTag: 'AIS-140 & CAN-bus',
    description: 'Custom Hiring Centre fleet dispatch, fuel/battery telemetry, and operator coordination.',
    prototypeBehaviour: 'Supervisor fleet dispatch console displaying 4 Custom Hiring Centre machines with live fuel/battery gauges, operator contacts, field sector assignments, and one-click dispatch/recall.',
    productionIntegration: 'MoRTH AIS-140 compliant GPS vehicle trackers + CAN-Bus J1939 telematics stream routed via MQTT broker.',
    security: 'Encrypted telemetry payloads; operator phone numbers masked in public interfaces.',
    offlineBehaviour: 'Tractor onboard AIS-140 device buffers GPS points in local flash memory during cellular blackouts.',
    failureBehaviour: 'Supervisor manual SMS dispatch to certified operator with voice phone confirmation.',
    judgeFaq: {
      question: 'Are there actual GPS beacons connected to physical tractors right now?',
      answer: 'INTEGRATION-READY — The prototype implements the full fleet operational console, dispatch workflows, and telemetry schema; production requires physical AIS-140 GPS hardware units.'
    }
  },
  {
    featureId: 'AUD-10',
    auditId: 'AUD-10',
    name: 'Multichannel IVR & Toll-Free Phone Integration',
    state: 'INTEGRATION_READY',
    subsystem: 'Kisan Mitra',
    badgeTag: 'C-DAC / SIP Trunk',
    description: 'Toll-free Kisan helpline, feature phone DTMF simulation, and voice prompts.',
    prototypeBehaviour: 'Integrated Kisan Helpline card with one-touch direct dial (1800-180-1551), simulated keypad feature phone SMS booking flows, and multilingual audio guidance prompts.',
    productionIntegration: 'C-DAC Kisan Call Centre SIP Trunking + Twilio / Exotel Voice XML IVR tree.',
    security: 'TRAI DLT compliant telecom headers; zero unencrypted audio storage.',
    offlineBehaviour: 'Telephony operates over standard 2G GSM cellular networks; requires zero smartphone internet.',
    failureBehaviour: 'Automatic failover to live district APMC call centre human operator.',
    judgeFaq: {
      question: 'Can a farmer on a simple 2G keypad phone actually use this system?',
      answer: 'INTEGRATION-READY — The data schema and queue notification payloads are formatted for two-way SMS and IVR voice synthesis; production deployment connects to the Kisan Call Centre SIP gateway.'
    }
  }
];

export class FeatureRegistryService {
  public static getAll(): FeatureRegistryItem[] {
    return [...SIH_FEATURE_REGISTRY];
  }

  public static getById(featureId: string): FeatureRegistryItem | undefined {
    return SIH_FEATURE_REGISTRY.find(f => f.featureId === featureId || f.auditId === featureId);
  }

  public static getBadgeStatus(featureId: string): IntegrationStatusBadge {
    const item = this.getById(featureId);
    if (!item) return 'PROPOSED';
    if (item.state === 'INTEGRATION_READY') return 'INTEGRATION-READY';
    return item.state;
  }
}
