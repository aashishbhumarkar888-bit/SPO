import React from 'react';
import { 
  Volume2, 
  Clock, 
  UserCheck, 
  Scale, 
  QrCode, 
  PhoneCall, 
  ArrowRight,
  WifiOff,
  CheckCircle2,
  MapPin,
  Barcode,
  Ticket,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AgriToken, LanguageCode, FarmerProfile } from '../../types';
import { getTranslations } from '../../i18n';
import { normalizeStatus, STATUS_DEFINITIONS } from '../../domain/statusModel';
import { speakAnnouncement, playAudioChime } from '../../utils/speech';

interface FarmerLiveQueueViewProps {
  token: AgriToken;
  farmer: FarmerProfile;
  language: LanguageCode;
  isOffline: boolean;
  onNavigateToTab: (tab: string) => void;
}

export const FarmerLiveQueueView: React.FC<FarmerLiveQueueViewProps> = ({
  token,
  farmer,
  language,
  isOffline,
  onNavigateToTab
}) => {
  const t = getTranslations(language);
  const standardStatus = normalizeStatus(token.status);
  const statusMeta = STATUS_DEFINITIONS[standardStatus];

  const handleAudioBroadcast = () => {
    playAudioChime();
    const hi = `ध्यान दें! टोकन संख्या ${token.tokenNumber}, किसान श्री ${farmer.fullNameHi}। आपका आबंटित काउंटर नंबर ${token.counterAssigned} है। वर्तमान स्थिति: ${statusMeta.labelHi}।`;
    const en = `Attention! Token number ${token.tokenNumber}, farmer ${farmer.fullName}. Assigned Counter is number ${token.counterAssigned}. Status: ${statusMeta.labelEn}.`;
    speakAnnouncement(language === 'hi' ? hi : en, language === 'hi' ? 'hi' : 'en');
  };

  const steps = [
    { title: t.stepGate, done: true, current: standardStatus === 'ARRIVED' },
    { title: t.stepCounter, done: ['IN_PROGRESS', 'COMPLETED'].includes(standardStatus), current: token.status === 'Called' || token.status === 'At Counter' },
    { title: t.stepWeighbridge, done: standardStatus === 'COMPLETED' || token.status === 'DBT Released', current: token.status === 'Weighbridge' },
    { title: t.stepPayment, done: standardStatus === 'COMPLETED', current: token.status === 'DBT Released' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in w-full">
      {/* Offline Mode Indicator */}
      {isOffline && (
        <div className="p-4 rounded-xl bg-amber-400 text-slate-950 border border-amber-500 flex items-center gap-3 font-semibold shadow-sm">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">{t.offlineCached}</span>
            <span>{t.offlinePassNotice} (Token: {token.tokenNumber}).</span>
          </div>
        </div>
      )}

      {/* Official Government Digital E-Pass */}
      <div className="bg-white dark:bg-[#0E241C] rounded-2xl border-2 border-[#168A5B] dark:border-[#22A872] overflow-hidden shadow-[0_8px_30px_rgba(6,59,42,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-colors">
        {/* Pass Header Banner */}
        <div className="bg-[#063B2A] dark:bg-[#081B13] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0B5D3B] dark:border-[#153A2C]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22A872] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#DDF4E9]">
                {t.digitalPassTitle}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-serif-display tracking-tight">
              {language === 'hi' && token.centreNameHi ? token.centreNameHi : token.centreName}
            </h3>
            <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#22A872]" />
              <span>Wardha Central APMC Mandi Yard • Gate Inward #1</span>
            </p>
          </div>

          <div className="sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-2 bg-white/10 dark:bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-white/10">
            <span className="text-xs text-white/70 block">{t.tokenNumber}</span>
            <span className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-tight">
              {token.tokenNumber}
            </span>
          </div>
        </div>

        {/* Pass Body Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Live Status & Counter Callout */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#063B2A] dark:bg-[#081B13] text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#168A5B]/30">
                <UserCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-base text-[#063B2A] dark:text-[#F0FAF5] font-serif-display">
                    {language === 'hi' ? statusMeta.labelHi : statusMeta.labelEn}
                  </h4>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusMeta.badgeClass}`}>
                    {token.status}
                  </span>
                </div>
                <p className="text-xs text-[#2C5343] dark:text-[#85AFA0] mt-0.5">
                  {token.peopleAhead === 0 
                    ? (language === 'hi' ? 'आपकी बारी आ चुकी है! काउंटर पर रिपोर्ट करें।' : 'Your turn right now! Report to assigned counter.') 
                    : `${token.peopleAhead} ${t.peopleAheadLabel} • ~${token.estimatedWaitMins} min est. wait`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] text-right shadow-xs">
                <span className="text-[10px] text-[#57786B] dark:text-[#85AFA0] uppercase tracking-wider block font-bold">
                  {t.counterAssignedLabel}
                </span>
                <span className="text-sm font-bold text-[#063B2A] dark:text-[#F0FAF5] font-mono">
                  Counter #{token.counterAssigned}
                </span>
              </div>
              <button
                onClick={handleAudioBroadcast}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0E241C] hover:bg-slate-100 dark:hover:bg-[#1A3C2F] border border-[#C7DCD1] dark:border-[#2B5E4A] text-[#0B5D3B] dark:text-[#6EE7B7] transition-all active:scale-95 shadow-xs"
                title="Hear audio broadcast"
              >
                <Volume2 className="w-5 h-5 text-[#168A5B] dark:text-[#22A872]" />
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B2A] dark:text-[#F0FAF5]">
              {t.journeyTitle}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    st.current
                      ? 'border-[#168A5B] dark:border-[#22A872] bg-[#DDF4E9] dark:bg-[#153A2C] ring-1 ring-[#168A5B]'
                      : st.done
                      ? 'border-[#E2ECE6] dark:border-[#1D4334] bg-[#F4F7F5] dark:bg-[#143026] text-[#063B2A] dark:text-[#F0FAF5]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1C15] text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5 text-[#063B2A] dark:text-[#F0FAF5]">
                    {st.done && !st.current ? '✓ ' : ''}
                    {st.title}
                  </div>
                  <span className="text-[10px] font-bold text-[#57786B] dark:text-[#85AFA0]">
                    {st.current ? t.currentStageBadge : st.done ? t.stageCompletedBadge : t.stagePendingBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Identification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-xl bg-[#F4F7F5] dark:bg-[#143026] border border-[#C7DCD1] dark:border-[#2B5E4A] text-xs transition-colors">
            <div>
              <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{language === 'hi' ? 'किसान का नाम' : 'Farmer'}</span>
              <strong className="text-[#063B2A] dark:text-[#F0FAF5]">{language === 'hi' ? farmer.fullNameHi : farmer.fullName}</strong>
            </div>
            <div>
              <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{t.kisanId}</span>
              <strong className="text-[#063B2A] dark:text-[#F0FAF5] font-mono">{farmer.kisanId}</strong>
            </div>
            <div>
              <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{t.cropLabel}</span>
              <strong className="text-[#063B2A] dark:text-[#F0FAF5]">
                {language === 'hi' && token.serviceDetails?.cropNameHi ? token.serviceDetails.cropNameHi : (token.serviceDetails?.cropName || 'Wheat')}
              </strong>
            </div>
            <div>
              <span className="text-[#57786B] dark:text-[#85AFA0] block font-semibold">{t.slotTime}</span>
              <strong className="text-[#063B2A] dark:text-[#F0FAF5] font-mono">{token.scheduledTime}</strong>
            </div>
          </div>

          {/* QR & Barcode Section for Fast ANPR & Gate Entry */}
          <div className="border-t border-[#E2ECE6] dark:border-[#1D4334] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-white dark:bg-[#F0FAF5] rounded-xl border border-slate-300 dark:border-white shadow-xs">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-[#063B2A] dark:text-[#F0FAF5] flex items-center gap-1.5 font-serif-display">
                  <span>Fast-Track ANPR Gate Barcode</span>
                  <Barcode className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </p>
                <p className="text-[11px] text-[#2C5343] dark:text-[#85AFA0]">
                  {t.qrInstruction}
                </p>
                <p className="text-[10px] font-mono text-[#57786B] dark:text-[#85AFA0]">
                  AUTH-KEY: SPO-WHD-{token.tokenNumber}-{farmer.kisanId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href="tel:18001801551"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#C7DCD1] dark:border-[#2B5E4A] hover:bg-white dark:hover:bg-[#1A3C2F] text-xs font-bold text-[#063B2A] dark:text-[#F0FAF5] flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#168A5B] dark:text-[#22A872]" />
                <span>{t.callSupportAction}</span>
              </a>

              <button
                onClick={() => onNavigateToTab('procurement')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] dark:bg-[#168A5B] dark:hover:bg-[#22A872] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 touch-target-48"
              >
                <span>{language === 'hi' ? 'तौल पर्ची स्थिति' : 'Procurement Slip'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
