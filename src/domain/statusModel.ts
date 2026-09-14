/**
 * Canonical Status Taxonomy & Transition Model for SPO (Smart Procurement Orchestration)
 * Unified across Farmer, Supervisor, and Backend services.
 */

export type StandardStatus = 
  | 'BOOKED'
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

export interface StatusMetadata {
  key: StandardStatus;
  labelEn: string;
  labelHi: string;
  descriptionEn: string;
  descriptionHi: string;
  badgeClass: string; // Restrained, accessible badge styling
  iconType: 'clock' | 'check' | 'alert' | 'user' | 'arrow' | 'x' | 'truck';
}

export const STATUS_DEFINITIONS: Record<StandardStatus, StatusMetadata> = {
  BOOKED: {
    key: 'BOOKED',
    labelEn: 'Booked',
    labelHi: 'बुक किया गया',
    descriptionEn: 'Slot reserved, awaiting arrival confirmation',
    descriptionHi: 'स्लॉट आरक्षित, आगमन पुष्टि की प्रतीक्षा',
    badgeClass: 'bg-[#F0F5F2] text-[#0B5D3B] border border-[#168A5B]/30',
    iconType: 'clock'
  },
  CONFIRMED: {
    key: 'CONFIRMED',
    labelEn: 'Confirmed',
    labelHi: 'पुष्टित',
    descriptionEn: 'Booking verified by central scheduling engine',
    descriptionHi: 'केंद्रीय निर्धारण प्रणाली द्वारा स्लॉट पुष्टित',
    badgeClass: 'bg-[#DDF4E9] text-[#063B2A] border border-[#168A5B]/40 font-semibold',
    iconType: 'check'
  },
  EXPECTED: {
    key: 'EXPECTED',
    labelEn: 'Expected Today',
    labelHi: 'आज अपेक्षित',
    descriptionEn: 'Scheduled for arrival during current operational window',
    descriptionHi: 'वर्तमान संचालन विंडो में केंद्र पर अपेक्षित',
    badgeClass: 'bg-[#EBF3FB] text-[#1B5299] border border-[#2878C8]/30 font-medium',
    iconType: 'clock'
  },
  ARRIVED: {
    key: 'ARRIVED',
    labelEn: 'Arrived at Gate',
    labelHi: 'गेट पर आगमन',
    descriptionEn: 'Gate inward completed; vehicle present on premises',
    descriptionHi: 'गेट इनवर्ड पूर्ण; वाहन केंद्र परिसर में उपस्थित',
    badgeClass: 'bg-[#DDF4E9] text-[#063B2A] border border-[#168A5B] font-bold',
    iconType: 'truck'
  },
  LATE: {
    key: 'LATE',
    labelEn: 'Late Arrival',
    labelHi: 'विलंबित आगमन',
    descriptionEn: 'Arrived past grace window; requeued by dynamic allocation policy',
    descriptionHi: 'अनुमत समय के बाद आगमन; नीति अनुसार पुनः कतारबद्ध',
    badgeClass: 'bg-[#FEF5E7] text-[#975B08] border border-[#D99121]/50 font-semibold',
    iconType: 'alert'
  },
  IN_QUEUE: {
    key: 'IN_QUEUE',
    labelEn: 'In Queue',
    labelHi: 'कतार में',
    descriptionEn: 'Active in physical queue progression awaiting counter call',
    descriptionHi: 'सक्रिय कतार में टोकन कॉल की प्रतीक्षा में',
    badgeClass: 'bg-[#DDF4E9] text-[#0B5D3B] border border-[#168A5B]/40 font-medium',
    iconType: 'user'
  },
  IN_PROGRESS: {
    key: 'IN_PROGRESS',
    labelEn: 'In Progress',
    labelHi: 'प्रक्रिया जारी',
    descriptionEn: 'Currently at counter verification, sampling or weighbridge',
    descriptionHi: 'काउंटर सत्यापन, नमूना जांच या तौल कांटे पर प्रक्रिया जारी',
    badgeClass: 'bg-[#F0F5F2] text-[#063B2A] border border-[#063B2A]/40 font-semibold',
    iconType: 'arrow'
  },
  COMPLETED: {
    key: 'COMPLETED',
    labelEn: 'Procurement Complete',
    labelHi: 'उपार्जन पूर्ण',
    descriptionEn: 'Weighbridge inward and DBT payment advice released',
    descriptionHi: 'तौल पर्ची व डीबीटी भुगतान सलाह जारी',
    badgeClass: 'bg-[#DDF4E9] text-[#063B2A] border border-[#168A5B] font-bold',
    iconType: 'check'
  },
  RESCHEDULED: {
    key: 'RESCHEDULED',
    labelEn: 'Rescheduled',
    labelHi: 'पुनर्निर्धारित',
    descriptionEn: 'Appointment shifted to an alternate operational date/time',
    descriptionHi: 'अन्य परिचालन तिथि या समय पर स्थानांतरित',
    badgeClass: 'bg-[#F0EDFB] text-[#4C3B9B] border border-[#7866D8]/40 font-medium',
    iconType: 'clock'
  },
  CANCELLED: {
    key: 'CANCELLED',
    labelEn: 'Cancelled',
    labelHi: 'रद्द किया गया',
    descriptionEn: 'Booking cancelled by farmer or system release policy',
    descriptionHi: 'किसान द्वारा या समय समाप्ति नीति द्वारा स्लॉट रद्द',
    badgeClass: 'bg-[#FDF2F2] text-[#A82323] border border-[#D95353]/30 font-medium',
    iconType: 'x'
  },
  NO_SHOW: {
    key: 'NO_SHOW',
    labelEn: 'No Show',
    labelHi: 'अनुपस्थित',
    descriptionEn: 'Did not arrive within 24-hour statutory grace period',
    descriptionHi: '24 घंटे की नियत अवधि में केंद्र पर उपस्थित नहीं हुए',
    badgeClass: 'bg-[#FDF2F2] text-[#A82323] border border-[#D95353]/40 font-semibold',
    iconType: 'x'
  }
};

/**
 * Normalizes any legacy string (e.g. 'Waiting', 'Called', 'At Counter', 'Completed')
 * into the canonical StandardStatus.
 */
export function normalizeStatus(status: string | undefined): StandardStatus {
  if (!status) return 'BOOKED';
  const clean = status.trim().toUpperCase().replace(/\s+/g, '_');
  
  if (clean === 'WAITING') return 'IN_QUEUE';
  if (clean === 'CALLED') return 'IN_PROGRESS';
  if (clean === 'AT_COUNTER') return 'IN_PROGRESS';
  if (clean === 'QUALITY_CHECK') return 'IN_PROGRESS';
  if (clean === 'WEIGHBRIDGE') return 'IN_PROGRESS';
  if (clean === 'DBT_RELEASED') return 'COMPLETED';
  if (clean === 'COMPLETED') return 'COMPLETED';
  if (clean === 'CANCELLED') return 'CANCELLED';
  if (clean === 'LATE') return 'LATE';
  if (clean === 'ARRIVED') return 'ARRIVED';
  if (clean === 'EXPECTED') return 'EXPECTED';
  if (clean === 'CONFIRMED') return 'CONFIRMED';
  if (clean === 'RESCHEDULED') return 'RESCHEDULED';
  if (clean === 'NO_SHOW') return 'NO_SHOW';
  
  return (clean in STATUS_DEFINITIONS) ? (clean as StandardStatus) : 'IN_QUEUE';
}
