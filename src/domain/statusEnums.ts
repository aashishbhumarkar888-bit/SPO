/**
 * AgriSeva Centralized Status Enums & Canonical State Dictionary
 * 
 * Strict single source of truth for all domain entities.
 * UI components and services must import from here and avoid ad-hoc strings.
 */

export type BookingStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'EXPECTED'
  | 'ARRIVED'
  | 'LATE'
  | 'IN_QUEUE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type IntegrationStatus =
  | 'LIVE'
  | 'SYNCED'
  | 'INTEGRATION_READY'
  | 'PROPOSED';

// For backward UI label compatibility
export type IntegrationStatusBadge = 'LIVE' | 'SYNCED' | 'INTEGRATION-READY' | 'PROPOSED';

export function normalizeIntegrationStatus(status: string): IntegrationStatus {
  const s = status.replace(/[\-_]/g, '').toUpperCase();
  if (s === 'LIVE') return 'LIVE';
  if (s === 'SYNCED') return 'SYNCED';
  if (s.includes('INTEGRATION') || s.includes('READY')) return 'INTEGRATION_READY';
  return 'PROPOSED';
}

export type QueueOperationalStatus = 
  | 'Waiting' 
  | 'Called' 
  | 'At Counter' 
  | 'Quality Check' 
  | 'Weighbridge' 
  | 'DBT Released' 
  | 'Completed' 
  | 'Cancelled';

export type QualityGrade = 
  | 'FAQ Grade A' 
  | 'Grade B' 
  | 'Below Fair';

export type DbtPaymentStatus = 
  | 'Credited' 
  | 'Processing' 
  | 'Held for Audit' 
  | 'Advice Generated' 
  | 'Pending Verification' 
  | 'Transferred' 
  | 'Disputed';

export type FleetOperationalStatus = 
  | 'Available' 
  | 'Dispatched' 
  | 'In-Field' 
  | 'Maintenance';

/**
 * Maps BookingStatus to user-facing localized badges
 */
export const BOOKING_STATUS_CONFIG: Record<BookingStatus, {
  labelEn: string;
  labelHi: string;
  badgeClass: string;
  descriptionEn: string;
  descriptionHi: string;
}> = {
  DRAFT: {
    labelEn: 'Draft',
    labelHi: 'प्रारूप',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    descriptionEn: 'Booking details being entered',
    descriptionHi: 'बुकिंग विवरण प्रविष्ट किया जा रहा है'
  },
  PENDING: {
    labelEn: 'Pending Verification',
    labelHi: 'सत्यापन लंबित',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    descriptionEn: 'Awaiting centre capacity confirmation',
    descriptionHi: 'केंद्र क्षमता पुष्टि की प्रतीक्षा'
  },
  CONFIRMED: {
    labelEn: 'Confirmed',
    labelHi: 'पुष्टि हो चुकी है',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    descriptionEn: 'Slot reserved with digital pass',
    descriptionHi: 'डिजिटल पास के साथ स्लॉट आरक्षित'
  },
  EXPECTED: {
    labelEn: 'Expected',
    labelHi: 'आगमन अपेक्षित',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-300',
    descriptionEn: 'Within today scheduled window',
    descriptionHi: 'आज निर्धारित समय विंडो में'
  },
  ARRIVED: {
    labelEn: 'Arrived at Gate',
    labelHi: 'गेट पर आगमन',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-300',
    descriptionEn: 'Physical vehicle check-in verified at inward gate',
    descriptionHi: 'इनवर्ड गेट पर वाहन आगमन सत्यापित'
  },
  LATE: {
    labelEn: 'Grace Period Active',
    labelHi: 'ग्रेस अवधि सक्रिय (विलंब)',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
    descriptionEn: 'Arrived past slot; requeued by 2 positions within 24h grace',
    descriptionHi: 'समय पश्चात आगमन; 24 घंटे की ग्रेस में 2 स्थान बाद कतार'
  },
  IN_QUEUE: {
    labelEn: 'In Active Queue',
    labelHi: 'कतार में प्रतीक्षा',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    descriptionEn: 'Token queued before service counters',
    descriptionHi: 'सेवा काउंटर के समक्ष टोकन सक्रिय'
  },
  IN_PROGRESS: {
    labelEn: 'At Service Counter',
    labelHi: 'काउंटर पर प्रसंस्करण',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-400 font-bold',
    descriptionEn: 'Weighbridge or inspection underway',
    descriptionHi: 'तौल या गुणवत्ता जांच प्रगति पर'
  },
  COMPLETED: {
    labelEn: 'Service Completed',
    labelHi: 'सेवा संपन्न',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    descriptionEn: 'Procurement recorded & DBT advice issued',
    descriptionHi: 'उपार्जन दर्ज व डीबीटी भुगतान सलाह जारी'
  },
  RESCHEDULED: {
    labelEn: 'Rescheduled',
    labelHi: 'समय परिवर्तित',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-300',
    descriptionEn: 'Moved to alternative authorized slot',
    descriptionHi: 'वैकल्पिक अधिकृत स्लॉट पर स्थानांतरित'
  },
  CANCELLED: {
    labelEn: 'Cancelled',
    labelHi: 'रद्द',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
    descriptionEn: 'Booking cancelled; centre capacity released',
    descriptionHi: 'बुकिंग रद्द; केंद्र क्षमता पुनः उपलब्ध'
  },
  NO_SHOW: {
    labelEn: 'No-Show Expired',
    labelHi: 'अनुपस्थित (समय समाप्त)',
    badgeClass: 'bg-red-100 text-red-900 border-red-400',
    descriptionEn: 'Farmer did not arrive within 24h grace window',
    descriptionHi: '24 घंटे की ग्रेस अवधि में किसान उपस्थित नहीं हुए'
  }
};
